#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
//#include <Ticker.h>  //Ticker Library
#define DOOR D5
#define FAN D6
#define LIGHT D7
int BUTTON = 16;
int temp = 0; 
#define DHTPIN 3    // what digital pin we're connected to
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

int door_state = 0;
int fan_state = 0;
int light_state = 0;

const char* ssid = "Raspberry";                   // wifi ssid
const char* password =  "tmatuan1511";         // wifi password
//const char* mqttServer = "192.168.4.1";    // IP adress Raspberry Pi
IPAddress mqttServer(192,168,4,1);
const int mqttPort = 1883;
const char* mqttUser = "";      // if you don't have MQTT Username, no need input
const char* mqttPassword = "";  // if you don't have MQTT Password, no need input

WiFiClient espClient;
PubSubClient client(espClient);


void setup() {

  Serial.begin(115200);
  Serial.println("DHTxx test!");
  pinMode(BUTTON, INPUT);

  dht.begin();
  pinMode(DOOR,OUTPUT);
  pinMode(FAN,OUTPUT);
  pinMode(LIGHT,OUTPUT);

  Serial.begin(115200);
  WiFi.persistent(false);
  WiFi.disconnect(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");

    if (client.connect("ESP8266Client111", mqttUser, mqttPassword )) {

      Serial.println("connected");
      Serial.print("IP address: ");
      Serial.println(WiFi.localIP());
    } else {

      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);

    }
  }
  
  client.subscribe("/Home/cfg");

}

void callback(char* topic, byte* payload, unsigned int length) {

  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }

  if (length < 10){
    if((char)payload[0] == 'r'){
      String final_send_r;
      final_send_r += '{';
      final_send_r += '"';
      final_send_r += "door";
      final_send_r += '"';
      
      final_send_r += ':';
      
      final_send_r += '"'; 
      String door_string_r = String(door_state);
      final_send_r += door_string_r;
      final_send_r += '"';
      
      final_send_r += ',';

      final_send_r += '"';
      final_send_r += "fan";
      final_send_r += '"';

      final_send_r += ':';

      final_send_r += '"';
      String fan_string_r = String(fan_state);
      final_send_r += fan_string_r;
      final_send_r += '"';

      final_send_r += ',';

      final_send_r += '"';
      final_send_r += "light";
      final_send_r += '"';

      final_send_r += ':';

      final_send_r += '"';
      String light_string_r = String(light_state);
      final_send_r += light_string_r;
      final_send_r += '"';
      final_send_r += '}';
    
      char to_send_r[50];
      final_send_r.toCharArray(to_send_r,50);
      client.publish("/Home/state", to_send_r);
      Serial.println(to_send_r);
    }
  }
  else if (length > 10){
    
    if ((char)payload[22] == '0'){
      door_state = 0;
      digitalWrite(DOOR, LOW);
      Serial.println("------------------------DOOR -------- 00000000000");
      }
    if ((char)payload[22] == '1'){
      door_state = 1;
      digitalWrite(DOOR, HIGH);
      Serial.println("------------------------DOOR -------- 11111111111");
      }
    if ((char)payload[9] == '0'){
      analogWrite(FAN,0);
      fan_state = 0;
      Serial.println("------------------------FAN -------- 00000000000");
      }
    if ((char)payload[9] == '1'){
      analogWrite(FAN,102);
      fan_state = 1;
      Serial.println("------------------------FAN -------- 111111111111");
      }
    if ((char)payload[9] == '2'){
      analogWrite(FAN,512);
      fan_state = 2;
      Serial.println("------------------------FAN -------- 2222222222222");
      }
    if ((char)payload[9] == '3'){
      analogWrite(FAN,1024);
      fan_state = 3;
      Serial.println("------------------------FAN -------- 33333333333333");
      }
    if ((char)payload[36] == '0'){
      analogWrite(LIGHT,0);
      light_state = 0;
      Serial.println("------------------------LIGHT -------- 00000000000");
      }
    if ((char)payload[36] == '1'){
      analogWrite(LIGHT,102);
      light_state = 1;
      Serial.println("------------------------LIGHT -------- 111111111111");
      }
    if ((char)payload[36] == '2'){
      analogWrite(LIGHT,512);
      light_state = 2;
      Serial.println("------------------------LIGHT -------- 2222222222222");
      }
    if ((char)payload[36] == '3'){
      analogWrite(LIGHT,1024);
      light_state = 3;
      Serial.println("------------------------LIGHT -------- 33333333333333");
      }        
  }
}

void loop() {
  temp = digitalRead(BUTTON);
     //Serial.println(temp);
     if (temp == HIGH) {
        //digitalWrite(led, HIGH);
        Serial.println("button pressed");
        
        if (door_state == 0){
          door_state = 1;
          digitalWrite(DOOR, HIGH);
          Serial.println("high");
          }
        else if (door_state == 1){
          door_state = 0;
          digitalWrite(DOOR, LOW);
          Serial.println("low");
          }

      String final_send;
      final_send += '{';
      final_send += '"';
      final_send += "door";
      final_send += '"';
      
      final_send += ':';
      
      final_send += '"'; 
      String door_string = String(door_state);
      final_send += door_string;
      final_send += '"';
      
      final_send += ',';

      final_send += '"';
      final_send += "fan";
      final_send += '"';

      final_send += ':';

      final_send += '"';
      String fan_string = String(fan_state);
      final_send += fan_string;
      final_send += '"';

      final_send += ',';

      final_send += '"';
      final_send += "light";
      final_send += '"';

      final_send += ':';

      final_send += '"';
      String light_string = String(light_state);
      final_send += light_string;
      final_send += '"';
      final_send += '}';
    
      char to_send[50];
      final_send.toCharArray(to_send,50);
      client.publish("/Home/state", to_send);
      Serial.println(to_send);
      delay(1000);
       }
     else {
        //digitalWrite(led, LOW);
        //Serial.println("button release");
        //delay(1000);
       }
  client.loop();
}