import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyleStyled = createGlobalStyle`
    body {
        height: 100%;
        margin: 0;
    }
`;

export const GlobalStyles = createGlobalStyle` 
  ${reset} 

    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
    }
    input, textarea { 
      -moz-user-select: auto;
      -webkit-user-select: auto;
      -ms-user-select: auto;
      user-select: auto;
    }
    input:focus {
      outline: none;
    }

    button {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
    }
`;
