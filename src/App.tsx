import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
      <>
          <div class={styles.App}>
              <header class={styles.header}>
                  <img src={logo} class={styles.logo} alt="logo"/>
                  <p>
                      Edit <code>src/App.tsx</code> and save to reload.
                  </p>
                  <a
                      class={styles.link}
                      href="https://github.com/solidjs/solid"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      Learn Solid
                  </a>
              </header>
          </div>
          <section>
              <h3>A few helpful reminders</h3>
              <ul>
                  <li>SolidJs supports conditionally-rendered <code>Show</code> components, like Vue. Syntax <a
                      href="https://www.solidjs.com/tutorial/flow_show">here</a>.
                  </li>
                  <li>Consider the Switch/Match components for conditionals with multiple conditions. <a
                      href='https://www.solidjs.com/tutorial/flow_dynamic'>Dynamic</a> may also be a good option.
                  </li>
                  <li>Consider <a href='https://www.solidjs.com/tutorial/flow_portal'>portals</a> for modals.</li>
                  <li><a href="https://www.solidjs.com/tutorial/flow_index"><code>For</code></a> cares about each piece of
                      data in your array, and the position of that data can change; <code>Index</code> cares about each
                      index in your array, and the content at each index can change.
                  </li>
                  <li><a href='https://www.solidjs.com/tutorial/flow_error_boundary'>Error boundaries</a> can be useful.
                  </li>
              </ul>
          </section>
      </>
  );
};

export default App;
