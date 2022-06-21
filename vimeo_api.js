var Vimeo = require('vimeo').Vimeo;

var config = require("./config")


var clients = {}
var getClient = function(account_id) {
	var client = clients[account_id]
	if(! client) {
		client = new Vimeo(config.auth[account_id].client_id, config.auth[account_id].client_secret, config.auth[account_id].access_token )
		clients[account_id] = client
	}
	return client
}

module.exports = {
	sendVideo : function(path, account_id) {
		client = getClient(account_id)

		var p = new Promise( (resolve, reject) => {
			client.upload(
				path,
				function (uri) {
					console.log('File upload completed. Your Vimeo URI is:', uri)
					resolve(uri)
				},
				function (bytesUploaded, bytesTotal) {
					var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
					console.log(bytesUploaded, bytesTotal, percentage + '%')
				},
				function (error) {
					console.log('Failed because: ' + error)
					reject()
				}
			)

		})
		return p
	},
	getVideoInfo : function(videoUri, account_id) {
		var client = getClient(account_id)
		var p = new Promise( (resolve, reject) => {
			client.request({
				path:videoUri,
			}, function (error, body, status_code, headers) {
					console.log('status code');
					console.log(status_code);
					console.log('headers');
					console.log(headers);
					if (error) {
						console.log('error', account_id, videoUri, error);
						reject(error)
					} else {
						console.log('body', account_id, videoUri, body);
						resolve(body);
					}
				}
			)
		})
		return p
	}

}