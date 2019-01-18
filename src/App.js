import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      pathName: window.location.pathname.replace('/wiki/', '') || ''
    };
    this.fetchWikiData();
  }

  componentDidMount() {
    document.addEventListener('scroll', () => {
      if (!this.progressBar) {
        return;
      }
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      this.progressBar.style.width = Math.round(scrolled) + '%';
    });
  }

  fetchWikiData = (subject = 'Fonction_à_sens_unique') => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', '*');

    const sujet =
      this.state.pathName || (this.subject && this.subject.value) || subject;
    fetch(
      // 'https://fr.wikipedia.org/w/api.php?action=query&list=random&rnlimit=5&format=json&origin=*',
      `https://fr.wikipedia.org/w/api.php?action=parse&page=${sujet}&format=json&origin=*`,
      // `https://en.wikipedia.org/w/api.php?action=parse&page=Agriculture_in_Saudi_Arabia&format=json&origin=*`,
      {
        mode: 'cors',
        header: myHeaders
      }
    )
      .then(response => {
        return response.json();
      })
      .then(body => {
        this.setState({ body, loading: false });
      })
      .catch(error => console.error(error));
  };

  render() {
    const { body } = this.state;
    return (
      <div className="App">
        {body && (
          <>
            <div className="progress-bar">
              <div ref={el => (this.progressBar = el)} />
            </div>
            <input
              type="text"
              ref={el => (this.subject = el)}
              placeholder="Rechercher un article"
            />
            <button type="submit" onClick={this.fetchWikiData}>
              Go
            </button>
            <h1>{body.parse.title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: body.parse.text['*']
              }}
            />
          </>
        )}
      </div>
    );
  }
}

export default App;
