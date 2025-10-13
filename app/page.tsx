import DoubleSlider from '@components/DoubleSlider';
import Input from '@components/Input';
import Select from '@components/Select';
import TextArea from '@components/TextArea';
import '@styles/buttons.scss';
import '@styles/user.scss';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '200px'
      }}
    >
      <button className='user secondary'>Button</button>

      <Input id='test-text' label='Test' placeholder='placeholder' />

      <select className='user plain light' name='test-select'>
        <option value={1}>1</option>
        <option value={2}>2</option>
      </select>

      <div>
        <div className='input-binary-group'>
          <input
            type='radio'
            name='radio-test'
            id='radio-test-1'
            className='user light'
          />
          <label htmlFor='radio-test-1'>Radio test 1</label>
        </div>
        <div className='input-binary-group'>
          <input
            type='radio'
            name='radio-test'
            id='radio-test-2'
            className='user light'
          />
          <label htmlFor='radio-test-2'>Radio test 2</label>
        </div>
      </div>

      <div className='input-binary-group'>
        <input type='checkbox' id='checkbox-test' className='user light' />
        <label htmlFor='checkbox-test'>Checkbox</label>
      </div>

      <div className='input-binary-group'>
        <label htmlFor='switch-test'>Switch</label>
        <input type='checkbox' id='switch-test' className='switch user light' />
      </div>

      <TextArea id='textarea-test' label='TextArea' />

      <Select
        label='New select'
        variant='text'
        id='new-select'
        options={[
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]}
      />

      <DoubleSlider min={0} max={100} />
    </div>
  );
}
