import requests
import flask

def hello_world(request):
    if request.args and 'video-id' in request.args:
        video_id = request.args.get('video-id')
        headers = {"Accept": "application/json", "Access-Control-Allow-Origin": "*"}
        url = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + str(video_id) + "&key=REDACTED"
        #url = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=_-rUZu0R_Ww&key=REDACTED"
        data = requests.get(url, headers=headers)
        l = []
        js = data.json()
        for i in js["items"]:
            l.append(i["snippet"]["topLevelComment"]["snippet"]["textDisplay"])
        ret = {"items": l}

        response = flask.jsonify(ret)
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST')

        return response
    else:
        return f'Bad request!'