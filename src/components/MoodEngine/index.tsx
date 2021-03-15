import { Component, MouseEvent } from 'react';

import { GlobalHotKeys } from 'react-hotkeys';
import { RouteComponentProps } from 'react-router-dom';

import Actions from 'src/components/Actions';
import colours from 'src/const/colours';
import quotesDecrease from 'src/const/quotes-decrease';
import quotesImprove from 'src/const/quotes-improve';

import './style.scss';

type Colour = typeof colours[number];
type QuoteDecrease = typeof quotesDecrease[number];
type QuoteImprove = typeof quotesImprove[number];
type Quote = QuoteDecrease | QuoteImprove;

interface ResponsiveVoiceOptions {
  onend?: () => void;
  onstart?: () => void;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface ResponsiveVoice {
  cancel(): void;
  isPlaying(): boolean;
  speak(text: string, voice: string, options?: ResponsiveVoiceOptions): void;
}

interface HistoryItem {
  colour: Colour;
  quote: Quote;
}

interface State {
  actionsOpen: boolean;
  autoReload: boolean;
  colour: Colour;
  decreaseMood: boolean;
  history: HistoryItem[];
  quote: Quote;
  quoteTransparent: boolean;
  speakingQuote: boolean;
}

const AUTO_RELOAD_MS = 3000;
const QUOTE_TRANSITION_MS = 400;

export default class MoodEngine extends Component<RouteComponentProps, State> {
  private autoReloadTimeout : null | number = null;
  private usedColours: Colour[] = [];
  private usedQuotes: Quote[] = [];

  get responsiveVoice() {
    return (window as typeof window & { responsiveVoice: ResponsiveVoice }).responsiveVoice;
  }

  get secondLastHistoryItem(): undefined | HistoryItem {
    return this.state.history[this.state.history.length - 2];
  }

  constructor(props: RouteComponentProps) {
    super(props);

    const { autoReload, decreaseMood } = this.parseLocationHash();

    const colour = this.getRandomColour();
    const quote = this.getRandomQuote(decreaseMood);

    this.state = {
      actionsOpen: false,
      autoReload,
      colour,
      decreaseMood,
      history: [{
        colour,
        quote
      }],
      quote,
      quoteTransparent: false,
      speakingQuote: false
    };

    this.goBack = this.goBack.bind(this);
    this.toggleActionsOpen = this.toggleActionsOpen.bind(this);
    this.toggleAutoReload = this.toggleAutoReload.bind(this);
    this.toggleMood = this.toggleMood.bind(this);
    this.toggleSpeakQuote = this.toggleSpeakQuote.bind(this);

    if (autoReload) {
      this.resetAutoReloadTimeout();
    }
  }

  cancelSpeaking() {
    this.responsiveVoice.cancel();
    this.setState({
      speakingQuote: false
    });
  }

  clearAutoReloadTimeout() {
    if (this.autoReloadTimeout !== null) {
      clearTimeout(this.autoReloadTimeout);
      this.autoReloadTimeout = null;
    }
  }

  getRandomArrayIndex(array: readonly unknown[]) {
    return Math.floor(array.length * Math.random());
  }

  getRandomArrayValue<T>(array: readonly T[], usedValues: T[], currentValue?: T) {
    if (array.length === usedValues.length) {
      usedValues.length = 0;
    }

    while (true) {
      const value = array[this.getRandomArrayIndex(array)];
      if (value !== currentValue && !usedValues.includes(value)) {
        usedValues.push(value);
        return value;
      }
    }
  }

  getRandomColour() {
    return this.getRandomArrayValue(colours, this.usedColours, this.state?.colour);
  }

  getRandomQuote(decreaseMood: boolean) {
    return this.getRandomArrayValue(decreaseMood ? quotesDecrease : quotesImprove, this.usedQuotes, this.state?.quote);
  }

  goBack() {
    const { secondLastHistoryItem } = this;
    if (!secondLastHistoryItem) {
      return;
    }

    this.setState((state) => ({
      history: state.history.slice(0, -1)
    }), () => {
      this.resetAutoReloadTimeout();
      this.setDisplay(secondLastHistoryItem.colour, secondLastHistoryItem.quote, false);
    });
  }

  handleLinkClick(event: MouseEvent) {
    event.stopPropagation();
  }

  parseLocationHash() {
    const options = this.props.location.hash.slice(1).split('&');
    return {
      autoReload: options.includes('auto-reload'),
      decreaseMood: options.includes('decrease-mood')
    };
  }

  reload(userAction: boolean) {
    if (userAction) {
      this.resetAutoReloadTimeout();
    }

    const colour = this.getRandomColour();
    const quote = this.getRandomQuote(this.state.decreaseMood);
    this.setState((state) => ({
      history: [
        ...state.history,
        {
          colour,
          quote
        }
      ]
    }), () => {
      this.setDisplay(colour, quote, userAction);
    });
  }

  render() {
    const { actionsOpen, autoReload, colour, decreaseMood, quote, quoteTransparent, speakingQuote } = this.state;
    return (
      <div className="MoodEngine" onClick={() => this.reload(true)} style={{ background: `#${colour}` }}>
        <GlobalHotKeys
          handlers={{
            GO_BACK: () => this.goBack(),
            RELOAD: () => this.reload(true),
            TOGGLE_MOOD: () => this.toggleMood(),
            TOGGLE_SPEAK_QUOTE: () => this.toggleSpeakQuote()
          }}
          keyMap={{
            GO_BACK: ['Backspace', 'Left'],
            RELOAD: ['Enter', 'Right', 'Space'],
            TOGGLE_MOOD: ['m'],
            TOGGLE_SPEAK_QUOTE: ['s']
          }}
        />
        <div className="title">{decreaseMood ? 'decrease' : 'improve'} your mood</div>
        <div className={`quote ${quoteTransparent ? 'transparent' : ''}`}>{quote}</div>
        <div className="footer">
          <div></div>
          <div className="info">
            Improve Your Mood 7 | <a href="https://github.com/deanylev/improve-your-mood" onClick={this.handleLinkClick} rel="noreferrer" target="_blank">Source</a> | Made by <a href="https://deanlevinson.com.au" onClick={this.handleLinkClick} rel="noreferrer" target="_blank">Dean Levinson</a>
          </div>
          <Actions
            autoReload={autoReload}
            canGoBack={!!this.secondLastHistoryItem}
            decreaseMood={decreaseMood}
            onGoBack={this.goBack}
            onToggleAutoReload={this.toggleAutoReload}
            onToggleMood={this.toggleMood}
            onToggleOpen={this.toggleActionsOpen}
            onToggleSpeakQuote={this.toggleSpeakQuote}
            open={actionsOpen}
            speakingQuote={speakingQuote}
          />
        </div>
      </div>
    );
  }

  resetAutoReloadTimeout() {
    this.clearAutoReloadTimeout();

    if (this.state.autoReload) {
      this.autoReloadTimeout = window.setTimeout(() => {
        this.reload(false);
        this.resetAutoReloadTimeout();
      }, AUTO_RELOAD_MS);
    }
  }

  setDisplay(colour: Colour, quote: Quote, closeActions: boolean) {
    this.cancelSpeaking();
    this.setState((state) => ({
      actionsOpen: closeActions ? false : state.actionsOpen,
      colour,
      quoteTransparent: true
    }), () => {
      setTimeout(() => {
        this.setState({
          quote,
          quoteTransparent: false
        });
      }, QUOTE_TRANSITION_MS);
    });
  }

  toggleSpeakQuote() {
    if (this.state.speakingQuote) {
      this.cancelSpeaking();
      this.resetAutoReloadTimeout();
      this.setState({
        speakingQuote: false
      });
    } else {
      this.clearAutoReloadTimeout();
      this.setState({
        speakingQuote: true
      });

      this.responsiveVoice.speak(this.state.quote, 'Australian Female', {
        onend: () => {
          this.setState({
            speakingQuote: false
          });
          if (this.state.autoReload) {
            this.reload(false);
          }
          this.resetAutoReloadTimeout();
        }
      });
    }
  }

  toggleActionsOpen() {
    this.setState((state) => ({
      actionsOpen: !state.actionsOpen
    }));
  }

  toggleAutoReload() {
    this.setState((state) => ({
      autoReload: !state.autoReload
    }), () => {
      this.resetAutoReloadTimeout();
    });
  }

  toggleMood() {
    this.setState((state) => ({
      decreaseMood: !state.decreaseMood,
      history: []
    }), () => {
      this.usedQuotes = [];
      this.reload(true);
    });
  }
}
