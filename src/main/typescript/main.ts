import {Presentation} from "./api/types.gen";
import {eventsJson, presentationJson} from "./json";
import {calculateDifference, timeDifferenceOfSeconds} from "./time";

const presentation: Presentation = JSON.parse(presentationJson);
const events: Array<Event> = JSON.parse(eventsJson);

const countdownEnd = new Date(presentation.countdownEnd);
const countdownRunTime = timeDifferenceOfSeconds(presentation.countdownInSeconds);

console.log('Presentation', presentation, 'Events?', events, 'Countdown End', countdownEnd);


function refreshCountdown() {
    const countdown = document.getElementById('countdown');
    if(countdown) {
        const difference = calculateDifference(new Date(), countdownEnd);
        if(difference.fullTimespan <= countdownRunTime.fullTimespan) {
            countdown.innerText = `${difference.days}:${difference.hours}:${difference.minutes}:${difference.seconds}:${difference.milliseconds}`;
        } else {
            countdown.innerText = "Countdown hasn't started yet";
        }

    }
    setTimeout(refreshCountdown, 50);
}
setTimeout(refreshCountdown, 50);