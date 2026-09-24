import latveria from '../assets/person-aita.jpg';
import rina from '../assets/person-daughter.jpg';
import garden from '../assets/scene-garden.jpg';
import mark from '../assets/person-doctor.jpg';

/** Household photos already in the repo — not a stock face grid. */
export const FAMILY_PHOTOS = {
  latveria,
  rina,
  garden,
  mark,
  home: garden,
};

export const GAME_PEOPLE = [
  { id: 'latveria', name: 'Latveria', relation: 'Mother', photo: latveria, pos: '50% 18%' },
  { id: 'rina', name: 'Rina', relation: 'Daughter', photo: rina, pos: '50% 20%' },
  { id: 'doom', name: 'Doom', relation: 'Son', photo: garden, pos: '30% 40%' },
  { id: 'mina', name: 'Mina', relation: 'ASHA worker', photo: latveria, pos: '70% 30%' },
  { id: 'bina', name: 'Bina', relation: 'Neighbour', photo: rina, pos: '20% 55%' },
  { id: 'arun', name: 'Arun', relation: 'Doctor', photo: mark, pos: '50% 50%' },
];

export const OBJECT_PHOTOS = {
  kettle: { photo: garden, pos: '15% 60%' },
  glasses: { photo: latveria, pos: '40% 25%' },
  medicine: { photo: rina, pos: '80% 70%' },
  keys: { photo: mark, pos: '50% 50%' },
  slippers: { photo: garden, pos: '70% 85%' },
  umbrella: { photo: garden, pos: '90% 20%' },
  cup: { photo: rina, pos: '10% 80%' },
  radio: { photo: mark, pos: '20% 20%' },
  gamosa: { photo: rina, pos: '55% 75%' },
  stick: { photo: garden, pos: '5% 40%' },
  clock: { photo: latveria, pos: '85% 10%' },
  frame: { photo: latveria, pos: '50% 10%' },
  tea: { photo: garden, pos: '40% 70%' },
  lamp: { photo: mark, pos: '60% 30%' },
  drum: { photo: rina, pos: '25% 45%' },
  rice: { photo: garden, pos: '55% 55%' },
  fish: { photo: garden, pos: '75% 50%' },
  bamboo: { photo: garden, pos: '8% 15%' },
  flower: { photo: rina, pos: '62% 18%' },
  banana: { photo: garden, pos: '88% 62%' },
  bird: { photo: garden, pos: '12% 8%' },
  lotus: { photo: rina, pos: '48% 88%' },
  mango: { photo: garden, pos: '33% 22%' },
};

export const STORY_SCENE_PHOTO = garden;
export const SPOT_SCENE_PHOTOS = [garden, garden, rina];
