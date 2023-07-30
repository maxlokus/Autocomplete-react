1. What is the difference between Component and PureComponent? Give
an example where it might break my app.
*PureComponent is an extended Component that implements shouldComponentUpdate() by default. With functional components `memo(Component, <predicate>)` is used instead.
It helps to get rid of unnecessary re-renders down the component tree. But it may break the app if shouldComponentUpdate function is implemented incorrectly (or is missing), which may cause child components to not receive required updates*

2. Context + ShouldComponentUpdate might be dangerous. Why is that?
   *The drawback of Context as a state management tool is that it makes everything wrapped in Context.Provider re-render when changin anything in it's state. For example with react-redux we can subscribe to a particular state property and watch only for relevant updates. For Contex it would require implementing a HoC similar to react-redux `connect()` to fix that. ShouldComponentUpdate on the other hand may block update caused by Context, resulting in inconsistent data flow.*
   
3. Describe 3 ways to pass information from a component to its PARENT.
  *1)Using a callback(dataToPass) as a prop; 2)using global state management solution (Context, Redux, Mobx, Zustand - you name it); 3) using DOM (data attributs etc.), external APIs like localStorage, or event-driven Publish–subscribe like solutions - though it will require extra effort to synchronize update with react renders*
  
4. Give 2 ways to prevent components from re-rendering.
   *PureComponent/memo/shouldComponentUpdate, react `key` attribute*
   
5. What is a fragment and why do we need it? Give an example where it might
break my app.
  *React.Fragment (<>) creates Virtual DOM container instead of inserting anything into actual DOM. It is usually used as a 'hack' to avoid adding extra DOM units, since react elements are required to have a single parent element because of React.createElement() implementation. Fragments may break layout or worse if embedded component or library depends on particular dom structure (though this most likely indicates bad code and should not be the case)*
   
6. Give 3 examples of the HOC pattern.
   *withRouter(UserPage) by react-router, withStyles(styles)(MyPage) by material-ui, connect(mapStateToProps, mapDispatchToProps)(MyPage) by react-redux*
   
7. What's the difference in handling exceptions in promises, callbacks
and async...await?
  *promises and async-await allow more flexible code structure due to ability to catch() an error from any place in promise chain or try/catch block, while callbacks require handling the exception scenario first before proceeding further*
   
8. How many arguments does setState take and why is it async.
   *setState has two arguments: <updatedState> and optional callback. It is made async due to: 1) state updates batching 2) it causes re-renders which is expensive operation performance-wise, thus async to ensure non-blocking experience. Later this has been improved further with react fibers & concurrent mode*
   
9. List the steps needed to migrate a Class to Function Component.
   *Replace class with function, replace state with useState and all class lifecycle methods with corresponding hooks, replace PureComponent with memo() if was present, optionally replace used HoCs with hooks for consistency*
   
10. List a few ways styles can be used with components.
    *traditional css or css extended with pre-processors like sass, styled components (css-in-js), using utility classes in a bootstrap or tailwind style, styling hooks (like mui)*
    
11. How to render an HTML string coming from the server.
    *Use html-react-parser or make your own, or use dangerouslySetInnerHTML={} which as the name implies not recommended*
