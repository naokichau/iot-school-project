import json
import sqlite3
import time
import datetime
import threading
import websocket
import paho.mqtt.client as mqtt
from collections import OrderedDict

broker_address = "localhost"  # or 192.168.4.1 - static ip address of raspberry pi
sub_topic = "/Home/cfg"
pub_topic = "/Home/state"
data = {}
json_string = ''
data_array = []
newWs = ''


def json_format(device, string):
    data = {"msgType": "devicedata", "data": {
        "devices": [{"deviceId": device, "data": string}]}}
    print json.dumps(data)
    newWs.send(json.dumps(data))


mqtt_client = mqtt.Client()  # create new instance


def on_message(ws, message):
    print(message)
    j = json.loads(message)
    if j['msgType'] == 'request':
        print "Request device state from app!"
        mqtt_client.publish(sub_topic, "request")

    if j['msgType'] == 'cmd':
        print j["data"]["data"]
        mqtt_client.publish(sub_topic, json.dumps(j["data"]["data"]))
        print "App state received!"


def on_error(ws, error):
    print(error)


def on_close(ws):
    print("### Connection closed ###")


def on_open(ws):
    print "Web socket opened!"


websocket.enableTrace(True)
newWs = websocket.WebSocketApp("ws://iot-bk-server.herokuapp.com/gateway",
                               on_message=on_message,
                               on_error=on_error,
                               on_close=on_close)


def on_connect_mqtt(client, userdata, flags, rc):
    print "Broker connected!"
    print("Subscribing to topic", pub_topic)
    mqtt_client.subscribe(pub_topic)


def on_subscribe_mqtt(mosq, obj, mid, granted_qos):
    print pub_topic
    print ("Subscribed: ", pub_topic)


def on_message_mqtt(mosq, obj, msg):
    global data_array
    print "---------------------------------"
    print "MQTT Data Received..."
    print "MQTT Topic: " + msg.topic
    print "Data: " + msg.payload
    print "---------------------------------"
    # send device state to app
    if msg.payload[2] == 'd':
        json_format("2", msg.payload)

    if msg.payload[2] == 't':
        json_format("1", msg.payload)


def MyThread1():
    print("creating new instance")
    mqtt_client.on_connect = on_connect_mqtt
    mqtt_client.on_subscribe = on_subscribe_mqtt
    mqtt_client.on_message = on_message_mqtt

    print("connecting to broker")
    mqtt_client.connect(broker_address)  # connect to broker
    mqtt_client.loop_forever()


def MyThread2():
    newWs.on_open = on_open
    newWs.run_forever()
    MyThread2()


t1 = threading.Thread(target=MyThread1, args=[])
t1.start()
t2 = threading.Thread(target=MyThread2, args=[])
t2.start()
t1.join()
t2.join()
