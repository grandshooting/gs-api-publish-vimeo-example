var path = require("path")
var config = require("./config")

var Promise = require("bluebird")
var request = require("superagent")

var {sendVideo, getVideoInfo} = require("./vimeo_api")

var fs = require("fs")
fs = Promise.promisifyAll(fs, {suffix:"WithPromise"})

var account_id = 1

//List valid pictures that belong to validation steps
const listPicturesToBroadcast = async function(from = 0, pics=[]) {
	const queryParams = {
			picturestatus : [50], //validated by users
			benchsteptype:40, //Validation steps
			export : "VIDEO"
		}
	console.log("list pictures", from, queryParams)
	return request.get("https://api.grand-shooting.com/v3/picture")
		.query (queryParams)
		.set("offset", from)
		.set("Authorization", "Bearer " + config.token)
		.type("json")
		.then(res => {
			var resPics = res.body
			console.log("resPics", from, resPics.length, resPics[0])
			if(resPics.length == 0) {
				return pics
			} else {
				pics = pics.concat(resPics)
				//We iterate through pagination to get more pictures
				return Promise.delay(250).then(() => listPicturesToBroadcast(from + resPics.length, pics))
			}
		})
}

const getPictureAsBlob = async function(picture) {
	var res = await request.get("https://api.grand-shooting.com/v3" + "/picture/" + picture.picture_id + "/download")
									.set('Authorization', "Bearer " + config.token)
									.responseType('blob')
	return res.body
}

var changePicturestatus = async function(picture, picturestatus ) {
	return request.post("https://api.grand-shooting.com/v3" + "/picture/" + picture.picture_id + "/picturestatus")
				.set("Authorization", "Bearer " + config.token)
				.type("json")
				.send({picturestatus:picturestatus})
				.then(res => {
					return Promise.delay(500)
				}).catch(e => console.error("error", e))
}


var publish = async function() {
	var pics = await listPicturesToBroadcast()

	return Promise.mapSeries(pics, async pic => {
		var blob = await getPictureAsBlob(pic) //Download picture and get result as a binary stream

		//Download File on disc and do whatever we want on it
		await fs.mkdirWithPromise("tmp", { recursive: true })
		await fs.writeFileWithPromise("tmp/" + pic.smalltext, blob)

		var videoURI = await sendVideo("tmp/" + pic.smalltext)
		var info = await getVideoInfo(videoURI)

		await changePicturestatus(pic, 55) //We mark pictures as published
	})
}

publish()