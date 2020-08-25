import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Select, Input } from 'antd';
import './index.css'

const { Option } = Select;

const Filter = (props) => {  
  const filterOptions = ['greater than', 'less than', 'equal to']

  const [modalVisible, modalVisibleSetter] = useState(false);
  const [modalVars, modalVarsSetter] = useState({})

  const showModal = () => {
    modalVisibleSetter(true);
  }

  const handleOk = () => {
    let filter = {
      type: modalVars.type,
      val: modalVars.val,
      column: modalVars.columnName,
    };

    props.onAdd(filter)

    modalVisibleSetter(false)
  }

  const handleCancel = () => {
    modalVisibleSetter(false)
  }

  const handleColumnSelect = (value) => {
    if(modalVisible)
      modalVarsSetter({
        ...modalVars,
        columnName: value,
      })
  }

  const handleFilterType = (value) => {
    if(modalVisible)
      modalVarsSetter({
        ...modalVars,
        type: value,
      })
  }

  const handleFilterValue = (tex) => {
    let value = tex.target.value;
    if(modalVisible)
      modalVarsSetter({
        ...modalVars,
        val: value,
      })
  }

  return (
    <div className="filter-container">
      <div className="filters">
        {props.filters.map((filter, key) => 
          <div className="filter" key={key}>
            <div className="filter-var">{filter.column}</div>
            <div className="filter-op">
              {(filter.type === "greater than") ? ">" : ( (filter.type === "less than") ? "<" : ( (filter.type === "equal to") ? "=" : filter.type ) )}
            </div>
            <div className="filter-val">{filter.val}</div>
            <Button type="danger" icon="close" onClick={() => props.handleRemove(key)} />
          </div>
        )}
      </div>
      <Button type="primary" id="addFilter" onClick={showModal}>Add Filter</Button>
      <Modal
          className="filter-modal"
          title="Choose filters"
          visible={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}>
        <Select
          style={{ width: "20em" }}
          onChange={handleColumnSelect}>
          {props.columnNames.map((columnName, id) => <Option value={columnName} key={id}>{columnName}</Option>)}
        </Select>
        <Select
          style={{ width: "20em" }}
          onChange={handleFilterType}>
          {filterOptions.map((filterName, k) => <Option key={k} value={filterName}>{filterName}</Option>)}
        </Select>
        <Input
          name="item"
          placeholder="Enter Value"
          style={{ width: '100%' }}
          onChange={handleFilterValue}/>
      </Modal>
    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filters: PropTypes.array,
  handleRemove: PropTypes.func,
  columnNames: PropTypes.array,
}

export default Filter;