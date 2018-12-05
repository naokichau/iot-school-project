#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#define LED D5
#define DHTPIN 3    // what digital pin we're connected to
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

//Ticker blinker;

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

  dht.begin();
  pinMode(LED,OUTPUT);

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
  
  //blinker.attach(5, do_everything);
  //client.publish("esp8266", "Hello Raspberry Pi");
  //client.subscribe("esp8266");
  //client.publish("/device/rec", to_send);
  //client.subscribe("/device/#");

}

void callback(char* topic, byte* payload, unsigned int length) {

  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }

  Serial.println();
  Serial.println("-----------------------");
  Serial.println();
  Serial.println("WiFi connected ");
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());   
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Password: ");
  Serial.println(WiFi.psk());
  Serial.println();

}

void loop() {
  
  delay(1000);
  //if(digitalRead(LED)== 0){
  //digitalWrite(LED,HIGH);}
  //else digitalWrite(LED,LOW);
  // Wait a few seconds between measurements.
  //delay(2000);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Heat index: ");
  Serial.print(hic);
  Serial.print(" *C ");
  Serial.print(hif);
  Serial.println(" *F");
  digitalWrite(LED,LOW);

  String final_send;
  final_send += '"';
  final_send += "temp";
  final_send += '"';

  final_send += ':';

  final_send += '"';
  String humidString;
  humidString = String(h);
  final_send += humidString;
  final_send += '"';

  final_send += ',';

  final_send += '"'; 
  final_send += "humid";
  final_send += '"';

  final_send += ':';
  
  final_send += '"';
  String tempString;
  tempString = String(t);
  final_send += tempString;
  final_send += '"';

  char to_send[50];
  final_send.toCharArray(to_send,50);
  client.publish("/Home/sensor_data", to_send);
  Serial.println(to_send);
  
  client.loop();
}