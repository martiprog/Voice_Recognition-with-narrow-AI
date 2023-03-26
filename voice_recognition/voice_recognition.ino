const int red_led_pin = 8;
const int yellow_led_pin = 9;
const int green_led_pin = 10;
String input_str = "";
String red_led_status = "rl";
String yellow_led_status = "yl";
String green_led_status = "gl";
void setup() {
  pinMode(red_led_pin, OUTPUT);
  pinMode(yellow_led_pin, OUTPUT);
  pinMode(green_led_pin, OUTPUT);
  Serial.begin(9600);
  digitalWrite(red_led_pin, LOW);
  digitalWrite(yellow_led_pin, LOW);
  digitalWrite(green_led_pin, LOW);
}

void loop() {
  if (Serial.available() > 0) {
    String input_str = Serial.readString();
    if (input_str.indexOf("on") > -1) 
    {
      if(input_str.indexOf("red") > -1)
      {
          Serial.println("on red");
          digitalWrite(red_led_pin, HIGH);
          red_led_status = "rh";
      }
       if(input_str.indexOf("yellow") > -1)
      {
          Serial.println("on yellow");
          digitalWrite(yellow_led_pin, HIGH);
          yellow_led_status = "yh";
      }
       if(input_str.indexOf("green") > -1)
      {
          Serial.println("on green");
          digitalWrite(green_led_pin, HIGH);
          green_led_status = "gh";
      }
    }
    if (input_str.indexOf("off") > -1) 
    {
      if(input_str.indexOf("red") > -1)
      {
          Serial.println("off red");
          digitalWrite(red_led_pin, LOW);
          red_led_status = "rl";
      }
       if(input_str.indexOf("yellow") > -1)
      {
          Serial.println("off yellow");
          digitalWrite(yellow_led_pin, LOW);
          yellow_led_status = "yl";
      }
       if(input_str.indexOf("green") > -1)
      {
          Serial.println("off green");
          digitalWrite(green_led_pin, LOW);
          green_led_status = "gl";
      }
      if(input_str.indexOf("all") > -1)
      {
          Serial.println("all off");
          digitalWrite(red_led_pin, LOW);
          digitalWrite(yellow_led_pin, LOW);
          digitalWrite(green_led_pin, LOW);
          red_led_status = "rl";
          yellow_led_status = "yl";
          yellow_led_status = "gl";
      }
    }

    if(input_str.indexOf("request") > -1){
              Serial.println("req:" + red_led_status + ";" + yellow_led_status + ";" + green_led_status + ";");
    }
  }
  delay(20);
}
