import { useMemo, useState } from 'react';
import Autocomplete from './components/Autocomplete/Autocomplete';
import { useFetch, useDebounce } from './hooks';
import { User } from './types';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 300);

  const requestUrl = useMemo(
    () => `https://jsonplaceholder.typicode.com/users?name_like=${debouncedInputValue}`,
    [debouncedInputValue]
  );
  const { data: users, loading } = useFetch<User[]>(requestUrl);
  const suggestions = (!!users && users.map(user => user.name)) || [];

  return (
    <div className='app'>
      <Autocomplete
        suggestions={suggestions}
        onInputChange={setInputValue}
        value={inputValue}
        isLoading={loading}
        label={'User name'}
        id={'user-name-selection'}
      />
    </div>
  );
};

export default App;
