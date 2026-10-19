import { domMax } from 'framer-motion';

// Загружается асинхронно (LazyMotion): анимационные фичи не входят в первый JS-бандл.
// domMax (а не domAnimation) — нужен drag для свайпа в лайтбоксе.
export default domMax;
