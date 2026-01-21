import React from 'react';
import { Composition } from 'remotion';
import { PromoVideo } from './PromoVideo';
import '../index.css';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PromoVideo"
                component={PromoVideo}
                durationInFrames={900} // 30 seconds at 30fps
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    title: "パラレル生物図鑑",
                    subtitle: "異世界観測ログ"
                }}
            />
        </>
    );
};
