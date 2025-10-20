import BinaryInput from '@components/BinaryInput';
import Button from '@components/Button';
import CircleSlider from '@components/CircleSlider';
import Divider from '@components/Divider';
import DoubleSlider from '@components/DoubleSlider';
import Input from '@components/Input';
import Pagination from '@components/Pagination';
import RadioCheckboxGroup from '@components/RadioCheckboxGroup';
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
      <Button variant='primary' beforeIconCode='star-solid'>
        Button
      </Button>

      <Input id='test-text' label='Test' placeholder='placeholder' />

      <RadioCheckboxGroup
        type='radio'
        options={[
          { label: 'Variant', value: 'variant' },
          { label: 'Option', value: 'option' }
        ]}
        name='radio-test-2'
      />

      <RadioCheckboxGroup
        type='checkbox'
        options={[
          { label: 'Variant', value: 'variant-checkbox' },
          { label: 'Option', value: 'option-checkbox' }
        ]}
        name='radio-test-2'
      />

      <BinaryInput
        type='checkbox'
        id='switch'
        name='switch'
        isSwitch
        label='Switch'
      />

      <TextArea id='textarea-test' label='TextArea' placeholder='placeholder' />

      <Divider>Divider</Divider>

      <Select
        label='Plain select'
        variant='plain'
        id='plain-select'
        options={[
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ]}
      />

      <Select
        label='Text select'
        variant='text'
        id='text-select'
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

      <p className='colored bold wide'>Wide colored bold text</p>
      <a href='#' className='underline'>
        Underlined link
      </a>

      <Pagination pages={11} current={1} />
    </div>
  );
}
