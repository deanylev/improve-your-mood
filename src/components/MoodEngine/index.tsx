import { Component, MouseEvent } from 'react';

import { GlobalHotKeys } from 'react-hotkeys';

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

interface Props {}

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

export default class MoodEngine extends Component<Props, State> {
  private autoReloadTimeout : null | number = null;

  get responsiveVoice() {
    return (window as typeof window & { responsiveVoice: ResponsiveVoice }).responsiveVoice;
  }

  get secondLastHistoryItem(): undefined | HistoryItem {
    return this.state.history[this.state.history.length - 2];
  }

  constructor(props: Props) {
    super(props);

    const colour = this.getRandomColour();
    const quote = this.getRandomQuote(false);

    this.state = {
      actionsOpen: false,
      autoReload: false,
      colour,
      decreaseMood: false,
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

  getRandomArrayValue<T>(array: readonly T[], currentValue?: T) {
    while (true) {
      const value = array[this.getRandomArrayIndex(array)];
      if (value !== currentValue) {
        return value;
      }
    }
  }

  getRandomColour() {
    return this.getRandomArrayValue(colours, this.state?.colour);
  }

  getRandomQuote(decreaseMood: boolean) {
    return this.getRandomArrayValue(decreaseMood ? quotesDecrease : quotesImprove, this.state?.quote);
  }

  goBack() {
    const { secondLastHistoryItem } = this;
    if (!secondLastHistoryItem) {
      return;
    }

    this.setState({
      history: this.state.history.slice(0, -1)
    }, () => {
      this.resetAutoReloadTimeout();
      this.setDisplay(secondLastHistoryItem.colour, secondLastHistoryItem.quote, false);
    });
  }

  handleLinkClick(event: MouseEvent) {
    event.stopPropagation();
  }

  reload(userAction: boolean) {
    if (userAction) {
      this.resetAutoReloadTimeout();
    }

    const colour = this.getRandomColour();
    const quote = this.getRandomQuote(this.state.decreaseMood);
    this.setState({
      history: [
        ...this.state.history,
        {
          colour,
          quote
        }
      ]
    }, () => {
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
    this.setState({
      actionsOpen: closeActions ? false : this.state.actionsOpen,
      colour,
      quoteTransparent: true
    }, () => {
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
    this.setState({
      actionsOpen: !this.state.actionsOpen
    });
  }

  toggleAutoReload() {
    const autoReload = !this.state.autoReload;
    this.setState({
      autoReload
    }, () => {
      this.resetAutoReloadTimeout();
    });
  }

  toggleMood() {
    this.setState({
      decreaseMood: !this.state.decreaseMood,
      history: []
    }, () => {
      this.reload(true);
    });
  }
}
