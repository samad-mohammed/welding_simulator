import React from 'react';

const VideoBackground = ({ videoSource, children }) => {
  return (
    <div className="video-background">
      <video autoPlay muted loop className="video" style={{ width: "100%", height: "100%", objectFit: "cover", position: "fixed", top: 0, left: 0, zIndex: -1 }}>
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {children}
    </div>
  );
};

export default VideoBackground;
