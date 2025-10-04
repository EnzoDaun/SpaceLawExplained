import React from 'react';

function Title() {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 text-center mt-5 pt-5">
          <div className="title-container animate-fade-in">
            <h1 className="display-1 fw-bold mb-4 gradient-text animate-float" style={{fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: '1.1'}}>
              Space Law Explained
            </h1>
            <p className="fs-3 text-light fw-light mb-0 subtitle" style={{fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', letterSpacing: '0.05em'}}>
              Seu caminho do saber pelas estrelas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Title;