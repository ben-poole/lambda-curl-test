var util = require('util'),
    exec = require('child_process').exec,
    https = require('https');

exports.handler = function(event, context) {
    var uri = '',
        cmd,
        curl;
    function callbackPost(data) {
        var post_data = JSON.stringify(data), // build the post body
            callbackUri = 'www.aerian.com',
            post_options = { // An object of options to indicate where to post to
                host: callbackUri,
                port: '443',
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(post_data)
                },
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            },
            post_req = https.request(post_options, function(res) { //Set up the request
               res.on('end', function() {
                    console.log('End of request');
                });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
        context.succeed('Checked headers of: ' + uri + ' and sent results to: ' + callbackUri);
    }



    if (!event.uri || event.uri === "$input.params('uri')") {
        console.log('uri not set from params, running in test mode... (www.aerian.com)');
        uri = 'www.aerian.com';
    } else {
        uri = event.uri;
    }

    // is uri valid?
    if (!!uri.match(/((ftp|http|https):\/\/|www\.)(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=<&%@!\-\/]))?/)) {
        cmd = "curl -s -D - " + uri + " -o /dev/null";
    } else {
        context.fail('Invalid URI:' + uri);
    }
    

    curl = exec(cmd);

    success = function(data) {
        // @todo write to 'Reciever API'
        //doPost(req, context.succeed);
        callbackPost(data);
        //context.succeed(data);
    };

    fail = function(data) {
        // @todo write to 'Reciever API'
        context.fail('Failed:' + data);
    };

    // Log process stdout and stderr
    curl.stdout.on('data', success);
    curl.stderr.on('data', fail);
};
