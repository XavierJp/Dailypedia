import React, { Component } from 'react';
import './App.css';

const zap = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="feather feather-zap"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      pathName:
        window.location.pathname.replace('/wiki/', '') ||
        'Agriculture_in_Saudi_Arabia'
    };
    this.getRandomUrl();
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
      this.progressBar.style.width = Math.round(scrolled * 100) / 100 + '%';
    });
  }

  getRandomUrl = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', '*');

    fetch(
      'https://fr.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*',
      {
        mode: 'cors',
        header: myHeaders
      }
    )
      .then(response => {
        return response.json();
      })
      .then(body => {
        const url = `https://fr.wikipedia.org/w/api.php?action=parse&pageid=${
          body.query.random[0].id
        }&format=json&origin=*`;
        this.fetchWikiData(url);
      })
      .catch(error => console.error(error));
  };

  fetchWikiData = (url = '') => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', '*');

    const sujet = this.state.pathName || (this.subject && this.subject.value);

    fetch(
      url ||
        `https://fr.wikipedia.org/w/api.php?action=parse&page=${sujet}&format=json&origin=*`,
      {
        mode: 'cors',
        header: myHeaders
      }
    )
      .then(response => {
        return response.json();
      })
      .then(body => {
        this.setState({ body, loading: false }, () => {
          document.documentElement.scrollTop = 0;
        });
      })
      .catch(error => console.error(error));
  };

  render() {
    const { body } = this.state;
    return (
      <div className="App">
        <div className="progress-bar">
          <div ref={el => (this.progressBar = el)} />
        </div>
        {/* <div className="search">
          <input
            type="text"
            ref={el => (this.subject = el)}
            placeholder="Rechercher un article"
          />
          <button type="submit" onClick={this.fetchWikiData}>
            Go
          </button>
        </div> */}
        <div className="random">
          <button type="submit" onClick={this.getRandomUrl}>
            {zap} Article aléatoire
          </button>
        </div>
        {body && body.parse && (
          <>
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
