import React from 'react';
import './App.scss';

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
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const RANDOM_URL =
  'https://fr.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*';
const ARTICLE_BY_ID = `https://fr.wikipedia.org/w/api.php?action=parse&pageid=§§§&format=json&origin=*`;
const ARTICLE_BY_TITLE = `https://fr.wikipedia.org/w/api.php?action=parse&page=§§§&format=json&origin=*`;

export interface IProps {}
export interface IState {
  pathName: string | null;
  loading: boolean;
  body: any | null;
}

export default class App extends React.PureComponent<IProps, IState> {
  private progressBar!: HTMLElement | null;
  private randomBtn!: HTMLButtonElement | null;

  public constructor(props: IProps) {
    super(props);

    const p =
      window.location.pathname.indexOf('wiki') >= 0
        ? window.location.pathname.split('/wiki/')
        : [];
    this.state = {
      body: null,
      loading: true,
      pathName: p[p.length - 1] || null,
    };
    if (!this.state.pathName) {
      this.getRandomUrl();
    } else {
      this.fetchWikiData();
    }
  }

  public componentDidMount() {
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

  private fetchData = async (url: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', '*');

    const response = await fetch(url, {
      mode: 'cors',
      headers: myHeaders,
    });

    return response.json();
  };

  private getRandomUrl = async () => {
    try {
      if (this.randomBtn) {
        this.randomBtn.classList.add('loading');
      }
      const dataRandom = await this.fetchData(RANDOM_URL);

      const urlById = ARTICLE_BY_ID.replace(
        '§§§',
        dataRandom.query.random[0].id,
      );

      const data = await this.fetchData(urlById);

      this.setState({ body: data, loading: false }, () => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (this.randomBtn) {
          this.randomBtn.classList.remove('loading');
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  private fetchWikiData = async (url = '') => {
    if (this.randomBtn) {
      this.randomBtn.classList.add('loading');
    }
    const sujet = this.state.pathName;

    if (!url && !sujet) {
      console.error('Should not happen');
    }

    const data = await this.fetchData(
      url || ARTICLE_BY_TITLE.replace('§§§', sujet || ''),
    );

    this.setState({ body: data, loading: false }, () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (this.randomBtn) {
        this.randomBtn.classList.remove('loading');
      }
    });
  };

  public render() {
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
          <button
            type="submit"
            onClick={this.getRandomUrl}
            ref={el => (this.randomBtn = el)}
          >
            <div className="donut" />
            <div className="content">{zap}</div>
          </button>
        </div>
        {body && body.parse && (
          <>
            <h1>{body.parse.title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: body.parse.text['*'],
              }}
            />
          </>
        )}
      </div>
    );
  }
}
