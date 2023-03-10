function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

for (let i = 0; i<10; i++){
    pausecomp(1000);
    console.log(`Mensagem ${i}`);
}

if (translation[0] > 100){
    move = true;
  }
  if (translation[0] < 0){
    move = false;
  }
  if (move){
    translation[0] -= 1;// esse valor pode ser setado para o speed
  } else {
    translation[0] += 1;
  }
  requestAnimationFrame(drawScene);