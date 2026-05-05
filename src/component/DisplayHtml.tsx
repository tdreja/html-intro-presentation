import React, { ReactElement } from 'react';
import { HtmlData } from '../model/Slide.ts';

type Props = {
    html: HtmlData,
};
export const DisplayHtml = ({ html }: Props): ReactElement => {
    return (
        <div className="display-html" dangerouslySetInnerHTML={{ __html: html }} />
    );
};
