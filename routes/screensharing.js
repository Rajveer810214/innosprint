import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';

const ScreenshotApp = () => {
  const screenshotRef = useRef();

  const takeScreenshot = async () => {
    try {
      // Get the current scroll position
      const scrollY = window.scrollY;

      // Scroll to the top of the page before taking the screenshot
      window.scrollTo(0, 0);

      // Capture the entire page
      const canvas = await html2canvas(document.body);

      // Scroll back to the original position
      window.scrollTo(0, scrollY);

      // Convert the canvas to a data URL
      const imageDataURL = canvas.toDataURL('image/png');

      // Save the data URL as an image file
      download(imageDataURL, 'full_page_screenshot.png', 'image/png');
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  return (
    <div>
      <h1>React Screenshot App</h1>
      <div ref={screenshotRef}>
        {/* Content you want to capture */}
        <p>This is the content you want to capture.</p>
      </div>
      <button onClick={takeScreenshot}>Take Full Page Screenshot</button>
    </div>
  );
};

export default ScreenshotApp;
