import React, { ReactElement } from 'react';
import { Html } from '../model/Slide.ts';
import { get } from '../model/TypeContainer.ts';

type Props = {
    html: Html,
};
export const DisplayHtml = ({ html }: Props): ReactElement => {
    return (
        <div className="display-html" dangerouslySetInnerHTML={{ __html: get(html) }} />
    );
};
