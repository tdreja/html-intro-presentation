import React, { ReactElement } from 'react';
import { EditorProps } from './EditorProps.ts';

export const SlideCarousell = ({}: EditorProps): ReactElement => {
    return (
        <div id="slide-carousel">
            <h6>Slides</h6>

            <div className="slide-thumb active">
                <div className="thumb-preview">
                    <div className="fake-line fake-title"></div>
                    <div className="fake-gap"></div>
                    <div className="fake-line fake-line-l"></div>
                    <div className="fake-line fake-line-m"></div>
                    <div className="fake-line fake-line-s"></div>
                </div>
                <div className="thumb-footer">
                    <span className="thumb-index">1</span>
                    <button className="btn btn-outline-danger btn-remove btn-sm"><span className="material-symbols-outlined">close</span></button>
                </div>
            </div>

            <div className="slide-thumb">
                <div className="thumb-preview">
                    <div className="fake-line fake-title"></div>
                    <div className="fake-gap"></div>
                    <div className="fake-img"></div>
                    <div className="fake-gap"></div>
                    <div className="fake-line fake-line-m"></div>
                </div>
                <div className="thumb-footer">
                    <span className="thumb-index">2</span>
                    <button className="btn btn-outline-danger btn-remove btn-sm"><span className="material-symbols-outlined">close</span></button>
                </div>
            </div>

            <div className="slide-thumb">
                <div className="thumb-preview">
                    <div className="fake-line fake-title" style={{ width: '70%' }}></div>
                    <div className="fake-gap"></div>
                    <div className="fake-line fake-line-l"></div>
                    <div className="fake-line fake-line-l"></div>
                    <div className="fake-line fake-line-m"></div>
                    <div className="fake-line fake-line-s"></div>
                </div>
                <div className="thumb-footer">
                    <span className="thumb-index">3</span>
                    <button className="btn btn-outline-danger btn-remove btn-sm"><span className="material-symbols-outlined">close</span></button>
                </div>
            </div>

            <div className="slide-thumb">
                <div className="thumb-preview">
                    <div className="fake-line fake-title" style={{ width: '40%' }}></div>
                    <div className="fake-gap"></div>
                    <div className="fake-img" style={{ width: '70%', height: '18px' }}></div>
                </div>
                <div className="thumb-footer">
                    <span className="thumb-index">4</span>
                    <button className="btn btn-outline-danger btn-remove btn-sm"><span className="material-symbols-outlined">close</span></button>
                </div>
            </div>

            <div id="carousel-actions">
                <button className="btn btn-outline-success btn-add">
                    <span className="material-symbols-outlined">add</span>
                    Neue Slide
                </button>
            </div>
        </div>
    );
};
