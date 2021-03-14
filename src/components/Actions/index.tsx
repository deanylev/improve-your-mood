import { Component, FocusEvent, MouseEvent } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import LoopIcon from '@material-ui/icons/Loop';
import MenuIcon from '@material-ui/icons/Menu';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import StopIcon from '@material-ui/icons/Stop';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import './style.scss';

interface Props {
  autoReload: boolean;
  canGoBack: boolean;
  decreaseMood: boolean;
  onGoBack: () => void;
  onToggleAutoReload: () => void;
  onToggleMood: () => void;
  onToggleOpen: () => void;
  onToggleSpeakQuote: () => void;
  open: boolean;
  speakingQuote: boolean;
}

export default class Actions extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleToggleAutoReload = this.handleToggleAutoReload.bind(this);
    this.handleToggleMood = this.handleToggleMood.bind(this);
    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleToggleSpeakQuote = this.handleToggleSpeakQuote.bind(this);
  }

  handleToggleAutoReload(event: MouseEvent) {
    event.stopPropagation();

    this.props.onToggleAutoReload();
  }

  handleGoBack(event: MouseEvent) {
    event.stopPropagation();

    this.props.onGoBack();
  }

  handleToggleSpeakQuote(event: MouseEvent) {
    event.stopPropagation();

    this.props.onToggleSpeakQuote();
  }

  handleToggleOpen(event: MouseEvent) {
    event.stopPropagation();

    this.props.onToggleOpen();
  }

  handleToggleMood(event: MouseEvent) {
    event.stopPropagation();

    this.props.onToggleMood();
  }

  preventFocus(event: FocusEvent) {
    (event.target as HTMLButtonElement).blur();
  }

  render() {
    const { autoReload, canGoBack, decreaseMood, open, speakingQuote } = this.props;
    return (
      <div className="Actions">
        <SpeedDial
          ariaLabel="actions"
          className="speedDial"
          direction="left"
          icon={<MenuIcon />}
          onClick={this.handleToggleOpen}
          onFocus={this.preventFocus}
          open={open}
        >
          <SpeedDialAction
            FabProps={{ disabled: !canGoBack }}
            icon={<SkipPreviousIcon />}
            onClick={this.handleGoBack}
            onFocus={this.preventFocus}
            tooltipPlacement="top"
            tooltipTitle="Previous Quote"
          />
          <SpeedDialAction
            icon={speakingQuote ? <StopIcon /> : <VolumeUpIcon />}
            onClick={this.handleToggleSpeakQuote}
            onFocus={this.preventFocus}
            tooltipPlacement="top"
            tooltipTitle={speakingQuote ? 'Stop Speaking Quote' : 'Speak Quote'}
          />
          <SpeedDialAction
            icon={decreaseMood ? <SentimentVerySatisfiedIcon /> : <SentimentVeryDissatisfiedIcon />}
            onClick={this.handleToggleMood}
            onFocus={this.preventFocus}
            tooltipPlacement="top"
            tooltipTitle={decreaseMood ? 'Improve Mood' : 'Decrease Mood'}
          />
          <SpeedDialAction
            FabProps={{ disabled: speakingQuote }}
            icon={autoReload ? <CloseIcon /> : <LoopIcon />}
            onClick={this.handleToggleAutoReload}
            onFocus={this.preventFocus}
            tooltipPlacement="top"
            tooltipTitle="Auto Reload"
          />
        </SpeedDial>
      </div>
    );
  }
}
