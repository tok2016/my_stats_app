import '@styles/buttons.scss';
import '@styles/inputs.scss';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '120px'
      }}
    >
      <button className='user outlined-light'>Button</button>

      <div>
        <label htmlFor='test' className='user light'>
          Test
        </label>
        <input
          id='test'
          type='text'
          placeholder='placeholder'
          className='user light'
        />
      </div>

      <select className='user light'>
        <option value={1}>1</option>
        <option value={2}>2</option>
      </select>

      <div>
        <input type='radio' name='radio-test' id='radio-test-1' />
        <label htmlFor='radio-test-1'>Radio test 1</label>
        <input type='radio' name='radio-test' id='radio-test-2' />
        <label htmlFor='radio-test-2'>Radio test 2</label>
      </div>
    </div>
  );
}
