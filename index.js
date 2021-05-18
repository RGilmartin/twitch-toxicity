require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const tmi = require('tmi.js');

var model;

var regex = /[a-z][A-Z]/

const client = new tmi.Client({
    channels: ['tpain']
});

client.connect();
initToxicity(.9);


client.on('message', (channel, tags, message, self) => {
    checkMessage(message);
});

//checkMessage("We're dudes on computers, moron. You are quite astonsishingly stupid.");

async function initToxicity(threshold) {
    model = toxicity.load(threshold)
}

function checkMessage(message) {
    model.then(mod => {
        mod.classify(message).then(predictions => {

            var flag = false;

            for(i = 0; i < 7; i++) {
                if(predictions[i].results[0].match == true) {
                    flag = true;
                }
            }

            if(flag == true) {
                console.warn("\x1b[31m",message + " needs reviewing");
            } else {
                console.log("\x1b[32m",message)
            }
        });
    });
}