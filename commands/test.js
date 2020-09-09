exports.run = (client,message,args) => {
  let randomslur1
  var slursarry = [
    `0 took a heavy hit! Ouch!`,
    `0 is leading the battle!`,
    `0 isn't giving up!`,
    `0 deals a massive blow to . That's going to hurt.`,
    `The raid party is working well together!`,
    `0 slips and falls over. Whoops!`,
    `0 prepares an attack! Look out!`,
    `0 is defending!`,
    `0 missed their attack!`,
    `0 is defending!`,
    `That attack landed 0! Nice one!`,
    `0 is changing position!`,
    `0 strikes!`,
    `Who needs a plan when you got 0?!`,
    `0 stands their ground.`,
`0 made a mistake. Sorry!`,
    `A glancing blow 0!`,
`Need some help? 0 is here!`,
    `0 is eager to get this over with.`,
    `Oh no! 0 is powering up!`,
    `Never gonna give 0 up!`,
    `0 is giving it all they got!`,
    `0 takes guard against 0`,
    `0 attempts to lead the next attack!`,
`Who needs a plan when you got 0 ?!`,
    `0 gets tripped up trying to dodge an attack. Be careful!`
  ]

function uiMessage(slursarry) {

return randomslur1 = slursarry[Math.floor(Math.random() * slursarry.length)];
}

uiMessage(slursarry)
console.log(randomslur1)
uiMessage(slursarry)
console.log(randomslur1)
uiMessage(slursarry)
console.log(randomslur1)
uiMessage(slursarry)
console.log(randomslur1)
uiMessage(slursarry)
console.log(randomslur1)
};

exports.help = {
  name: 'test'
};
