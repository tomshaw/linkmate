const OptionsTabs = [{
  name: 'General',
  component: 'FormGeneral',
  tabRef: '#tab1',
  divId: 'tab1',
  checked: false,
  enabled: true
}, {
  name: 'Databases',
  component: 'FormDatabase',
  tabRef: '#tab2',
  divId: 'tab2',
  checked: false,
  enabled: true
}, {
  name: 'Categories',
  component: 'FormCategory',
  tabRef: '#tab3',
  divId: 'tab3',
  checked: true,
  enabled: true
}, {
  name: 'Theme',
  component: 'FormTheme',
  tabRef: '#tab4',
  divId: 'tab4',
  checked: false,
  enabled: true
}, {
  name: 'Synthesizer',
  component: 'FormSynthesizer',
  tabRef: '#tab5',
  divId: 'tab5',
  checked: false,
  enabled: true
}, {
  name: 'Privacy Policy',
  component: 'FormPrivacy',
  tabRef: '#tab6',
  divId: 'tab6',
  checked: false,
  enabled: false
}, {
  name: 'Contact Us',
  component: 'FormContact',
  tabRef: '#tab7',
  divId: 'tab7',
  checked: false,
  enabled: true
}, {
  name: 'About',
  component: 'FormAbout',
  tabRef: '#tab8',
  divId: 'tab8',
  checked: false,
  enabled: true
}]

export default OptionsTabs;