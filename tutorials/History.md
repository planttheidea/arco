Creating a history object is useful if your application uses routing (which most do). As such, `arco` makes the creation of various types of history as painless as possible:

* [Standard](#standard)
* [Custom](#custom)

#### Standard

For most applications, use of a standard history is sufficient for routing.

```javascript
import {
  createHistory
} from 'arco';

export default createHistory('hash');
```

There are three types of standard histories:
* [browser](https://github.com/ReactTraining/react-router/blob/master/docs/API.md#browserhistory) (default) = HTML5 History API, using clean URLs and `pushState` (Modern browsers)
* [hash](https://github.com/ReactTraining/react-router/blob/master/docs/API.md#hashhistory) = Include hash in URL (IE9-)
* [memory](https://github.com/ReactTraining/react-router/blob/master/docs/API.md#creatememoryhistoryoptions) = In-memory history that does not interact with the browser URL
    * Can also pass a second parameter of `options` to `createHistory`

#### Custom

In the case you want to use a custom history, you can instead pass a function to `createHistory` and return your own:

```javascript
import createHashHistory from 'history/lib/createHashHistory';
import {
  createHistory
} from 'arco';

export default createHistory((useRouterHistory) => {
  return useRouterHistory(createHashHistory)({
    queryKey: false
  });
});
```
