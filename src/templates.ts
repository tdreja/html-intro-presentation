import { Template } from './model/Template.ts';
import { DateTimeFormatter } from '@js-joda/core';

const templateDateFormat = DateTimeFormatter.ofPattern('dd.MM.yyyy');

export const templates: Array<Template> = [];
