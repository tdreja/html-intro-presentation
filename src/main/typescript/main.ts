import {Presentation} from "./api/types.gen";
import {eventsJson, presentationJson} from "./json";

const presentation: Presentation = JSON.parse(presentationJson);
const events: Array<Event> = JSON.parse(eventsJson);

console.log('Presentation', presentation, 'Events?', events);