import CircleSlider from '@components/CircleSlider';
import DoubleSlider from '@components/DoubleSlider';
import Input from '@components/Input';
import Select from '@components/Select';
import TextArea from '@components/TextArea';
import '@styles/modules.scss';

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
      <button className='filled'>Button</button>

      <Input id='test-text' label='Test' placeholder='placeholder' />

      <select className='plain light' name='test-select'>
        <option value={1}>1</option>
        <option value={2}>2</option>
      </select>

      <div>
        <div className='input-binary-group'>
          <input
            type='radio'
            name='radio-test'
            id='radio-test-1'
            className='light'
          />
          <label htmlFor='radio-test-1'>Radio test 1</label>
        </div>
        <div className='input-binary-group'>
          <input
            type='radio'
            name='radio-test'
            id='radio-test-2'
            className='light'
          />
          <label htmlFor='radio-test-2'>Radio test 2</label>
        </div>
      </div>

      <div className='input-binary-group'>
        <input type='checkbox' id='checkbox-test' className='light' />
        <label htmlFor='checkbox-test'>Checkbox</label>
      </div>

      <div className='input-binary-group'>
        <label htmlFor='switch-test'>Switch</label>
        <input type='checkbox' id='switch-test' className='switch light' />
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

      <DoubleSlider
        label='Double slider'
        id='double-slider'
        min={0}
        max={100}
      />

      <CircleSlider
        label='Circle slider'
        id='circle-slider'
        min={0}
        max={100}
      />

      {/* <CircleSlider
        label='Circle slider 2'
        id='circle-slider-2'
        min={100}
        max={200}
      /> */}
    </div>
  );
}
