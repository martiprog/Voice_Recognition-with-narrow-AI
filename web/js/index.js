var recognizer = new webkitSpeechRecognition();
recognizer.interimResults = true;
const socket = io();
var lang_btn = $("#lang");
var nav_ul = $("nav button ul");
var speaking_btn = $("#speaking_btn");
var lang_stat = "english";
var bef_el = $("#bef_el");
var first_part = $("#first_part");
var controller = $("#controller");
var controller_text = $("#controller p");
var status_li = $("#status li");
var red = $("#red");
var red_icon = $("#red i");
var green = $("#green");
var green_icon = $("#green i");
var yellow = $("#yellow");
var yellow_icon = $("#yellow i");
var main_title = $("#main_title");
var status_count = 0;
var status_p = $("#status_p");
var controller_btn = $("#controller_btn");
var controller_btn_line = $("#controller_btn_line");
var controller_btn_stat = 0;
var half_transp_foregr = $("#half_transp_foregr");
var led_stat_arr;
$(document).ready(function() {
    recognizer.lang = "en-US";
   
})
// 0 - BG | 1 - BG
lang_btn.click(function () {
    // За падащо меню с езици
    if (lang_stat == "english") {
        nav_ul.addClass("move");
        lang_stat = "bulgarian";
        main_title.text("Гласов контрол на светодиод");
        $("#speaking p").text("Говорене");
        $("#controller p").text("Контролер");
        $("#active").text("Активни: ");
        $("#active_val").text(count_led_indicators());
        $("#red~p").text("Червен светодиод");
        $("#green~p").text("Зелен светодиод");
        $("#yellow~p").text("Жълт светодиод");
        globalThis.recognizer.lang = "bg-BG";
        speaking_btn.attr('title',"Започнете да говорите(Enter)");
        if(controller_btn_stat === 1){
          controller_btn.attr("title", "Изключи гласово потвърждаване");
          }else{
            controller_btn.attr("title", "Включи гласово потвърждаване");
          }
        
    } else {
        nav_ul.removeClass("move");
        lang_stat = "english";
        main_title.text("Voice control of LED");
        $("#speaking p").text("Speaking");
        $("#controller p").text("Controller");
        $("#active").text("Active: ");
        $("#active_val").text(count_led_indicators());
        $("#red~p").text("Red LED");
        $("#green~p").text("Green LED");
        $("#yellow~p").text("Yellow LED");
        globalThis.recognizer.lang = "en-US";
        speaking_btn.attr('title',"Start speaking(Enter)");
        
          if(controller_btn_stat === 1){
            controller_btn.attr("title", "Disable voice confirmation");
            }else{
              controller_btn.attr("title", "Enable voice confirmation");
            }
    }
    console.log(lang_stat);
})

controller_btn.click(function(){
  if(controller_btn_stat == 0){
    controller_btn_line.removeClass("controller_btn_off");
    controller_btn_line.addClass("controller_btn_on");
    controller_btn_stat = 1;
    
    if(recognizer.lang === "en-US"){
      controller_btn.attr("title", "Disable voice confirmation");
    }
    if(recognizer.lang === "bg-BG"){
      controller_btn.attr("title", "Изключи гласово потвърждаване");
    }
    console.log(controller_btn_stat);
  }else{
    controller_btn_line.removeClass("controller_btn_on");
    controller_btn_line.addClass("controller_btn_off");
    controller_btn_stat = 0;
    if(recognizer.lang === "en-US"){
      controller_btn.attr("title", "Enable voice confirmation");
    }
    if(recognizer.lang === "bg-BG"){
      controller_btn.attr("title", "Включи гласово потвърждаване");
    }
    console.log(controller_btn_stat);
  }
});



//Код за връзка със сървър!

socket.on("closed_port",function(d){
     console.log(d);
     alert(d);
})
socket.on("setup",function(d){
  socket.emit("led_state_request","");
  half_transp_foregr.addClass("half_transp_foregr_on");

})
socket.on("leds-status",function(data){
  led_stat_arr = data.split(";");
  //alert(led_stat_arr);
  initiate_led_status(led_stat_arr);
  half_transp_foregr.removeClass("half_transp_foregr_on");
  

});


socket.on("controller_data",function(data){
  console.log("controller_data: " + data);
  if(recognizer.lang === "en-US"){
       if(data.indexOf("on") > -1){
             if(data.indexOf("red") > -1){
              $("#controller p").text("The red LED is turned ON!");
              set_led_indicator("red",1);
              speach_anouncement(recognizer.lang,controller_btn_stat,"The red LED is turned on!");
             }
             if(data.indexOf("yellow") > -1){
              $("#controller p").text("The yellow LED is turned ON!");
              set_led_indicator("yellow",1);
              count_led_indicators();
              speach_anouncement(recognizer.lang,controller_btn_stat,"The yellow LED is turned on!");
             }
             if(data.indexOf("green") > -1){
              $("#controller p").text("The green LED is turned ON!");
              set_led_indicator("green",1);
              speach_anouncement(recognizer.lang,controller_btn_stat,"The green LED is turned on!");
             }
       }
       if(data.indexOf("off") > -1){

        if(data.indexOf("red") > -1){
          $("#controller p").text("The red LED is turned OFF!");
          set_led_indicator("red",0);
          speach_anouncement(recognizer.lang,controller_btn_stat,"The red LED is turned off!");
         }
         if(data.indexOf("yellow") > -1){
          $("#controller p").text("The yellow LED is turned OFF!");
          set_led_indicator("yellow",0);
          speach_anouncement(recognizer.lang,controller_btn_stat,"The yellow LED is turned off!");
         }
         if(data.indexOf("green") > -1){
          $("#controller p").text("The green LED is turned OFF!");
          set_led_indicator("green",0);
          speach_anouncement(recognizer.lang,controller_btn_stat,"The green LED is turned off!");
         }
         if(data.indexOf("all") > -1){
          $("#controller p").text("ALL LEDs are turned OFF!");
          set_led_indicator("all",0);
          speach_anouncement(recognizer.lang,controller_btn_stat,"ALL LEDs are turned OFF!");  
         }
       }

  }
  if(recognizer.lang === "bg-BG")
  {
    if(data.indexOf("on") > -1){
      if(data.indexOf("red") > -1){
       $("#controller p").text("Червеният светодиод е ВКЛЮЧЕН!");
       set_led_indicator("red",1);
       speach_anouncement(recognizer.lang,controller_btn_stat,"Червеният светодиод е включен!");  
       
      }
      if(data.indexOf("yellow") > -1){
        $("#controller p").text("Жълтият светодиод е ВКЛЮЧЕН!");
       set_led_indicator("yellow",1);
       speach_anouncement(recognizer.lang,controller_btn_stat,"Жълтият светодиод е включен!"); 
      }
      if(data.indexOf("green") > -1){
        $("#controller p").text("Зеленият светодиод е ВКЛЮЧЕН!");
       set_led_indicator("green",1);
       speach_anouncement(recognizer.lang,controller_btn_stat,"Зеленият светодиод е включен!"); 
      }
}
if(data.indexOf("off") > -1){

 if(data.indexOf("red") > -1){
  set_led_indicator("red",0);
  speach_anouncement(recognizer.lang,controller_btn_stat,"Червеният светодиод е изключен!");
  }
  if(data.indexOf("yellow") > -1){
    $("#controller p").text("Жълтият светодиод е ИЗКЛЮЧЕН!");
    set_led_indicator("yellow",0);
    speach_anouncement(recognizer.lang,controller_btn_stat,"Жълтият светодиод е изключен!");
    
  }
  if(data.indexOf("green") > -1){
    $("#controller p").text("Зеленият светодиод е ИЗКЛЮЧЕН!");
    set_led_indicator("green",0);
    speach_anouncement(recognizer.lang,controller_btn_stat,"Зеленият светодиод е изключен!");
  }
  if(data.indexOf("all") > -1){
   $("#controller p").text("ВСИЧКИ светодиоди са ИЗКЛЮЧЕНИ!");
  set_led_indicator("all",0);
  speach_anouncement(recognizer.lang,controller_btn_stat,"Всички светодиоди са изключени!");
  }
}

  }
})
speaking_btn.click(function () {
    speaking_btn.toggleClass("speaking_btn_active");
    first_part.toggleClass("first_part_active");
    bef_el.toggleClass("bef_el_active");
    speech();
})
$(document).ready(function () {
    $(document).keypress(function () {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' || keycode == '32') {
            speaking_btn.toggleClass("speaking_btn_active");
            first_part.toggleClass("first_part_active");
            bef_el.toggleClass("bef_el_active");
        }
    });
})


var btn = document.getElementById("speaking_btn");
var check_box = document.getElementById("ch");
var start_setup = false;
var speach_stat = 0;

const arr_color_en = ["red","green","yellow"];
const arr_on_en = ["on","start"];
const arr_off_en = ["off","stop","shut down"];
const arr_everything_off_en = ["all","everything"];

//BG-words
const arr_color_bg = ["червен","зелен","жълт"];
const arr_on_bg = ["включ","пус","старт"];
const arr_off_bg = ["изключ","спи","спир"];
const arr_everything_off_bg = ["всич","всек"];
var arr_activated_leds = [];
var correct_color_en = 0;
var led_state = "";
var led_color = "";

function setup_start() {
  if (start_setup == false) {
    btn.disabled = false;
    lang_btn.disabled = false;
    start_setup = true;
  }
}
//Активиране на списъка с езици и бутона отново.
setup_start();
//Стартираме функцията speach,ако бутонът за слушане е натиснат.
function speech() {
  if(recognizer.lang == "en-US"){
  $("#speaking p").text("Speaking");
  $("#controller p").text("Controller");
  speaking_btn.attr('title',"End listening(Enter)");
  
  }else{
    $("#speaking p").text("Говорене");
    $("#controller p").text("Контролер");
    speaking_btn.attr('title',"Спрете слушането(Enter)");
  }
  $("#controller").css("color", "#C5C5C5");
  $("#speaking p").css("color", "#C5C5C5");
  //Ако бутонът не е бил натиснат втори път след началото на слушането.
  if (speach_stat === 0) {
    start_listen(btn, lang_btn);
  }
  //Ако бутонът е бил натиснат втори път след началото на слушането.
  else {
    end_listen(btn, lang_btn);
    recognizer.stop();
    recognizer.isFinal == true;
  }
}

recognizer.onresult = function (event) {
  var result = event.results[event.resultIndex];

  if (result.isFinal) {
    end_listen(btn, lang_btn);
    var ready_result = result[0].transcript;
    $("#speaking p").text(ready_result);
    $("#speaking p").css("color", "black");
    ready_result = ready_result.toLowerCase();
    $("#controller").css("color", "black");
    analys_voice(ready_result);
  } else {
    console.log(result[0].transcript);
    $("#speaking p").text(result[0].transcript);
    $("#speaking p").css("color", "black");
  }
};

recognizer.onend = function () {
  lang_btn.removeAttr("disabled");
  console.log("voice recognition terminated");
  end_listen(btn, lang_btn);
};

function end_listen(btn, lang_btn) {
  speaking_btn.removeClass("speaking_btn_active");
  first_part.removeClass("first_part_active");
  bef_el.removeClass("bef_el_active");
  speach_stat = 0;
  if(recognizer.lang === "en-US"){
    speaking_btn.attr('title',"Start listening(Enter)");
    }
    if(recognizer.lang === "bg-BG"){
      
      speaking_btn.attr('title',"Започнете да говорите(Enter)");
      }
  console.log("It has ended!");
  
}
function start_listen(btn, lang_btn) {
  if(recognizer.lang == "en-US"){
    $("#speaking p").text("Controller");
  }else{
    $("#speaking p").text("Контролер");
  }
  $("#controller p").css("color", "#C5C5C5");
  $("#lang").attr("disabled", "true");
  speaking_btn.addClass("speaking_btn_active");
  first_part.addClass("first_part_active");
  bef_el.addClass("bef_el_active");
  lang_btn.disabled = true;
  btn.style.color = "purple";
  speach_stat = 1;
  console.log("It has started!");
  recognizer.start();
}

function analys_voice(speach){
  $("#controller p").css("color", "black");
    if (recognizer.lang === "en-US")
    {
    let on_result = check_word_in_speach(arr_on_en,speach,0);
    let off_result = check_word_in_speach(arr_off_en,speach,0);
    let color_result = check_word_in_speach(arr_color_en,speach,1);
    let all_off = check_word_in_speach(arr_everything_off_en,speach,0);
    
    if((on_result >= 1 && off_result >= 1) || (on_result === 0 && off_result === 0)){
        $("#controller p").text("Please determine state of LED!");
        speach_anouncement(recognizer.lang,controller_btn_stat,"Please determine state of LED!");
        return;
    }
    if(all_off > 0)
    {
        if(on_result > 0){
          $("#controller p").text("You can NOT turn all LEDs simultaneously!");
           speach_anouncement(recognizer.lang,controller_btn_stat,"You can NOT turn all LEDs simultaneously!");
        }
        if(off_result > 0){
            turn_off_led(led_color,1);
        }
        return;
    }
    if(color_result != 1){
            console.log("Please determine the colour of LED!");
            $("#controller p").text("Please determine the colour of LED!");
            speach_anouncement(recognizer.lang,controller_btn_stat,"Please determine the colour of LED!");
            return;
        }
    
    if(on_result == 1){
        led_state = 1;
        turn_on_led(led_color);
    }
    else{
        led_state = 0;
        turn_off_led(led_color,0);
    }
    }
    if(recognizer.lang === "bg-BG")
    {
        var on_result = check_word_in_speach(arr_on_bg,speach,0);
      var off_result = check_word_in_speach(arr_off_bg,speach,0);
      var color_result = check_word_in_speach(arr_color_bg,speach,1);
      var all_off = check_word_in_speach(arr_everything_off_bg,speach,0);
    if((on_result >= 1 && off_result >= 1) || (on_result === 0 && off_result === 0)){
        $("#controller p").text("Моля определете състоянието на светодиода!");
        speach_anouncement(recognizer.lang,controller_btn_stat,"Моля определете състоянието на светодиода!");
        return;
    }
    if(all_off > 0)
    {
        if(on_result > 0){
          $("#controller p").text("НЕ може да изключите всички светодиоди ЕДНОВРЕМЕННО!");
          speach_anouncement(recognizer.lang,controller_btn_stat,"не може да изключите всички светодиоди едновременно!");
        } 
        if(off_result > 0){
            turn_off_led(led_color,1);
        }
        return;
    }
    if(color_result != 1){
            console.log("Моля определете цвета на светодиода!");
            $("#controller p").text("Моля определете цвета на светодиода!");
            speach_anouncement(recognizer.lang,controller_btn_stat,"Моля определете цвета на светодиода!");
            return;
        }
    if(on_result == 1){
        led_state = 1;
        turn_on_led(led_color);
    }
    else{
        led_state = 0;
        turn_off_led(led_color,0);
    }
    }
    }  
function check_word_in_speach(arr,speach,led_speach_enable){
    let len;
    let regex_text = "";
    let correct_result = 0;
    for (var i = 0; i < arr.length;i++ ){
    
    if(i < (arr.length-1)){
    
    regex_text += arr[i] + "|";
    
    }else {
    regex_text += arr[i];
    }
    }
    let regex_pattern = new RegExp(regex_text,"gi");
    
    let result = speach.match(regex_pattern);
    
    
    if( result == null){
    
    len = 0;
    
    } else {
    
    len = result.length;
    if(led_speach_enable === 1){
        led_color = result[0]
    }
    }
    
    if (len == 1) {
    
    correct_result = 1;
    
    
    } else if(len > 1){
    
    correct_result = 2;
    }
    else{
        correct_result = 0;
    }
    return correct_result;
    }
    
//Функция,отговаряща за генерирането на гласов отговор.
//Съдържа параметър language - език(en,bg).
function speach_anouncement(language, stat,text) {
  console.log("fsdfd");
  var synth = window.speechSynthesis;
  var voice_speach = new SpeechSynthesisUtterance(text);
  if (language == "en-US") {
    voice_speach.lang = 'en-US';
  } else {
    voice_speach.lang = 'bg-BG';
  }
   if(stat == 1){
      synth.speak (voice_speach);
    }
}

function turn_on_led(led){
  if(recognizer.lang === "en-US"){
  if(led === "red"  && led_stat_arr[0] == "rl"){
    console.log("Turning red LED on...");
    $("#controller p").text("Turning red LED ON...");
    socket.emit("on","red");
  }
  else if(led_stat_arr[0] == "rh" && led === "red")
  {
    console.log("The red LED has already been turned ON!");
    $("#controller p").text("The red LED has already been turned ON!");
    speach_anouncement(recognizer.lang,controller_btn_stat,"The red LED has already been turned on!");
  }


  if(led === "yellow" && led_stat_arr[1] == "yl"){
    console.log("Turning yellow LED ON...");
    $("#controller p").text("Turning yellow LED ON...");
    socket.emit("on","yellow");
  }
  else if(led === "yellow" && led_stat_arr[1] == "yh")
  {
    console.log("The yellow LED has already been turned ON!");
    $("#controller p").text("The yellow LED has already been turned ON!");
    speach_anouncement(recognizer.lang,controller_btn_stat,"The yellow LED has already been turned on!");
  }
  if(led === "green" && led_stat_arr[2] == "gl"){
      console.log("Turning green LED on...");
      $("#controller p").text("Turning green LED on...");
      socket.emit("on","green");
  }
  else if(led_stat_arr[2] == "gh" && led === "green")
  {
    console.log("The green LED has already been turned ON!");
    $("#controller p").text("The green LED has already been turned ON!");
    speach_anouncement(recognizer.lang,controller_btn_stat,"The green LED has already been turned on!");
  }
}
if(recognizer.lang === "bg-BG"){
  if(led.includes("червен") && led_stat_arr[0] == "rl"){
    console.log("Turning red LED on...");
    $("#controller p").text("Включване на червеният светодиод...");
      socket.emit("on","red");
  }
  else if(led_stat_arr[0] == "rh" && led.includes("червен"))
  {
    console.log("Червеният светодиод вече е бил ВКЛЮЧЕН");
    $("#controller p").text("Червеният светодиод вече е бил ВКЛЮЧЕН");
    speach_anouncement(recognizer.lang,controller_btn_stat,"Червеният светодиод вече е бил включен");
  }
  if(led.includes("жълт") && led_stat_arr[1] == "yl"){
    console.log("Turning yellow LED ON...");
    $("#controller p").text("Включване на жълт светодиод...");
    socket.emit("on","yellow");
  }
  else if(led_stat_arr[1] == "yh" && led.includes("жълт"))
  {
    console.log("Жълтият светодиод вече е бил ВКЛЮЧЕН");
    $("#controller p").text("Жълтият светодиод вече е бил ВКЛЮЧЕН!");
    speach_anouncement(recognizer.lang,controller_btn_stat,"Жълтият светодиод вече е бил включен");
  }
  if(led.includes("зелен") && led_stat_arr[2] == "gl"){
      console.log("Turning green LED on...");
      $("#controller p").text("Включване на зелен светодиод...");
      socket.emit("on","green");
  }
  else if(led.includes("зелен") && led_stat_arr[2] == "gh")
  {
    console.log("Зеленият светодиод вече е бил ВКЛЮЧЕН");
    $("#controller p").text("Зеленият светодиод вече е бил ВКЛЮЧЕН!");
    speach_anouncement(recognizer.lang,controller_btn_stat,"Зеленият светодиод вече е бил включен");
  }
}
}

function turn_off_led(led,all){
  if(all === 0){
  if(recognizer.lang === "en-US"){
    if(led === "red" && led_stat_arr[0] == "rh"){
      console.log("Turning red LED on...");
      $("#controller p").text("Turning red LED OFF...");
      socket.emit("off","red");
    }
    else if(led === "red" && led_stat_arr[0] == "rl")
    {
      console.log("The red LED has already been turned OFF!");
      $("#controller p").text("The red LED has already been turned OFF!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"The red LED has already been turned off!");
    }
    console.log(`led_stat ${led_stat_arr[1]} colour: ${led}`);
    if(led === "yellow" && led_stat_arr[1] == "yh"){
        console.log("Turning yellow LED OFF...");
        $("#controller p").text("Turning yellow LED OFF...");
        socket.emit("off","yellow");
    }
    else if(led_stat_arr[1] == "yl" && led === "yellow")
    {
      console.log("The yellow LED has already been turned OFF!");
      $("#controller p").text("The yellow LED has already been turned OFF!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"The yellow LED has already been turned off!");
    }

    if(led === "green" && led_stat_arr[2] == "gh"){
      console.log("Turning green LED off...");
      $("#controller p").text("Turning green LED off...");
      socket.emit("off","green");
    }
    else if(led_stat_arr[2] == "gl" && led === "green")
    {
      console.log("The green LED has already been turned OFF!");
      $("#controller p").text("The green LED has already been turned OFF!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"The green LED has already been turned off!");
    }
  }
  if(recognizer.lang === "bg-BG"){
    if(led.includes("червен") && led_stat_arr[0] == "rh"){
      console.log("Turning red LED off...");
      $("#controller p").text("Изключване на червеният светодиод...");
        socket.emit("off","red");
    }
    else if(led_stat_arr[0] == "rl" && led.includes("червен")) 
    {
      console.log("Червеният светодиод вече е бил ИЗКЛЮЧЕН!");
      $("#controller p").text("Червеният светодиод вече е бил ИЗКЛЮЧЕН!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"Червеният светодиод вече е бил изключен!");
    }

    if(led.includes("жълт") && led_stat_arr[1] == "yh"){
        console.log("Turning yellow LED OFF...");
        $("#controller p").text("Изключване на жълт светодиод...");
        socket.emit("off","yellow");
    
    }
    else if(led_stat_arr[1] == "yl" && led.includes("жълт"))
    {
      console.log("Червеният светодиод вече е бил ИЗКЛЮЧЕН!");
      $("#controller p").text("Червеният светодиод вече е бил ИЗКЛЮЧЕН!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"Жълтият светодиод вече е бил изключен!");
    }
    if(led.includes("зелен") && led_stat_arr[2] == "gh"){
      console.log("Turning green LED off...");
      $("#controller p").text("Изключване на зелен светодиод...");
          socket.emit("off","green");
    }
   else if(led.includes("зелен") && led_stat_arr[2] == "gl")
   {
      console.log("Зеленият светодиод вече е бил ВКЛЮЧЕН!");
      $("#controller p").text("Зеленият светодиод вече е бил ИЗКЛЮЧЕН!");
      speach_anouncement(recognizer.lang,controller_btn_stat,"Зеленият светодиод вече е бил изключен!");
   }
  
  }
}
else{
  if(recognizer.lang === "en-US"){
      if(led_stat_arr[0] == "rl" && led_stat_arr[1] == "yl" && led_stat_arr[2] == "gl"){
        $("#controller p").text("ALL LEDs have already been turned off!");
        speach_anouncement(recognizer.lang,controller_btn_stat,"All LEDs have already been turned off!");
      }else{
        console.log(`en-US: ${led_stat_arr[0]};${led_stat_arr[1]};${led_stat_arr[2]}`);
      $("#controller p").text("Turning EVERITHING OFF...");
      socket.emit("off","all");
      }
    }
    else{
      if(led_stat_arr[0] == "rl" && led_stat_arr[1] == "yl" && led_stat_arr[2] == "gl"){
        $("#controller p").text("ВСИЧКИ светодиоди вече са били изключени!");
        speach_anouncement(recognizer.lang,controller_btn_stat,"ВСИЧКИ светодиоди вече са били изключени!");
      }
      else{
      $("#controller p").text("Изключване на всички светодиоди...");
      socket.emit("off","all");
      }
    }
    
}
}

function initiate_led_status(led_stat_arr){
      for(let i = 0; i < 3; i++){
        if(led_stat_arr[i].indexOf("h") > -1){
          if(led_stat_arr[i].indexOf("r") > -1){
              set_led_indicator("red",1);
          }
          if(led_stat_arr[i].indexOf("y") > -1){
            set_led_indicator("yellow",1);
            status_count = 0;
          }
          if(led_stat_arr[i].indexOf("g") > -1){
            set_led_indicator("green",1);
            status_count = 0;
          }
        }
        if(led_stat_arr[i].indexOf("l") > -1){
          if(led_stat_arr[i].indexOf("r") > -1){
            set_led_indicator("red",0);
            status_count = 0;
        }
        if(led_stat_arr[i].indexOf("y") > -1){
          set_led_indicator("yellow",0);
          status_count = 0;
        }
        if(led_stat_arr[i].indexOf("g") > -1){
          console.log("dsfsfsd");
          set_led_indicator("green",0);
          status_count = 0;
        }
        }
      }
}

function set_led_indicator(color,state) {
  if(state === 0){
    if(color === "red"){
      $("#red").removeClass("icon_on");
      $("#red").addClass("icon_off");
      red_icon.text("close");
      $("#active_val").text(count_led_indicators());
      led_stat_arr[0] = "rl";
    }
    if(color === "yellow"){
      $("#yellow").removeClass("icon_on");
      $("#yellow").addClass("icon_off");
      yellow_icon.text("close");
      $("#active_val").text(count_led_indicators());
      led_stat_arr[1] = "yl";
    }
    if(color === "green"){
      $("#green").removeClass("icon_on");
      $("#green").addClass("icon_off");
      green_icon.text("close");
      $("#active_val").text(count_led_indicators());
      led_stat_arr[2] = "gl";
  }
  if(color === "all"){
    $("#red").removeClass("icon_on");
   $("#red").addClass("icon_off");
   red_icon.text("close");
   $("#yellow").removeClass("icon_on");
   $("#yellow").addClass("icon_off");
   yellow_icon.text("close");
   $("#green").removeClass("icon_on");
   $("#green").addClass("icon_off");
   green_icon.text("close");
  $("#active_val").text(count_led_indicators());
  led_stat_arr[0] = "rl";
  led_stat_arr[1] = "yl";
  led_stat_arr[2] = "gl";
}
}
else{
  if(color === "red"){
    $("#red").removeClass("icon_off");
    $("#red").addClass("icon_on");
    red_icon.text("done");
    led_stat_arr[0] = "rh";
    $("#active_val").text(count_led_indicators());
  }
  if(color === "yellow"){
    $("#yellow").removeClass("icon_off");
    $("#yellow").addClass("icon_on");
    yellow_icon.text("done");
    $("#active_val").text(count_led_indicators());
    led_stat_arr[1] = "yh";
  }
  if(color === "green"){
    $("#green").removeClass("icon_off");
    $("#green").addClass("icon_on");
    green_icon.text("done");
    $("#active_val").text(count_led_indicators());
    led_stat_arr[2] = "gh";
}
}
console.log(`${led_stat_arr[0]};${led_stat_arr[1]};${led_stat_arr[2]}`);
}


function count_led_indicators(){
  let led_count = $(".icon_on").length;
  if(led_count === 3 && $("#active").text() === "Active: "){
    led_count += " (ALL)"
  }
  if(led_count === 3 && $("#active").text() === "Активни: "){
    led_count += " (ВСИЧКИ)"
  }
  return led_count;
}