import { MoodData } from './types';

// Mood emojis
export function getMoodEmoji(mood: string): string {
  switch (mood) {
    case 'happy':
      return '😊';
    case 'angry':
      return '😠';
    case 'sad':
      return '😢';
    case 'embarrassed':
      return '😳';
    default:
      return '😐';
  }
}

// Mood data for the modal
export function getMoodData(mood: string): MoodData {
  switch (mood) {
    case 'happy':
      return {
        emoji: '😊',
        description: 'Luna is in a good mood and feeling positive towards you. She might be more open and friendly than usual.',
        effects: [
          'Response tone will be cheerful and enthusiastic',
          'More likely to use happy kaomojis and emojis',
          'May be more receptive to personal questions',
          'Might show more affection than usual'
        ]
      };
    case 'angry':
      return {
        emoji: '😠',
        description: 'Luna is irritated and in a bad mood. She might be more short with you than usual.',
        effects: [
          'Responses will be shorter and more dismissive',
          'Will use annoyed kaomojis like (￣︿￣)',
          'Less likely to engage in longer conversations',
          'Will need positive interactions to calm down'
        ]
      };
    case 'sad':
      return {
        emoji: '😢',
        description: 'Luna is feeling down. She might need some cheering up.',
        effects: [
          'Responses show vulnerability beneath her tsundere facade',
          'Will use sadder kaomojis like (´• ᵕ •`) ♡',
          'Might seek comfort but not directly ask for it',
          'More receptive to kind words and reassurance'
        ]
      };
    case 'embarrassed':
      return {
        emoji: '😳',
        description: 'Luna is flustered and easily embarrassed. Compliments and teasing will make this worse (or better).',
        effects: [
          'Responses will be more flustered and defensive',
          'Uses blushing kaomojis like (//ω//)',
          'Has trouble forming coherent responses when teased',
          'Might suddenly change topics out of embarrassment'
        ]
      };
    default:
      return {
        emoji: '😐',
        description: 'Luna is in her default tsundere state - alternating between dismissive comments and moments of genuine interest.',
        effects: [
          'Balanced between cold and warm responses',
          'Will use a variety of kaomojis',
          'May be slightly dismissive but still engaged',
          'Will show occasional moments of unexpected warmth'
        ]
      };
  }
}

// Affection levels
export function getAffectionLevel(affection: number): string {
  if (affection >= 80) {
    return 'In Love';
  } else if (affection >= 60) {
    return 'Close';
  } else if (affection >= 40) {
    return 'Friends';
  } else if (affection >= 20) {
    return 'Acquaintances';
  } else {
    return 'Curious';
  }
}
