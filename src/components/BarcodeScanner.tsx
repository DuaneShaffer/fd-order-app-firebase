import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner: React.FC = () => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerRef.current!
      },
      decoder: {
        readers: ["code_128_reader"]
      }
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(data => {
      console.log(data.codeResult.code);
      // Handle barcode data
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />;
};

export default BarcodeScanner;
