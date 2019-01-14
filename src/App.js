import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
    this.fetchWikiData();
  }

  fetchWikiData = (subject = 'Fonction_à_sens_unique') => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', '*');

    const sujet = (this.subject && this.subject.value) || subject;
    fetch(
      // 'https://fr.wikipedia.org/w/api.php?action=parse&list=random&rnlimit=5',
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
            <input ref={el => (this.subject = el)} />
            <button onClick={this.fetchWikiData}>Go</button>
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
