import { useEffect, useId, useRef, useState } from 'react'

export default function LeadSelect({ labelId, value, options, placeholder, required, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const listId = useId()
  const selectedIndex = options.indexOf(value)

  useEffect(() => {
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setOpen(true)
    requestAnimationFrame(() => optionRefs.current[index]?.focus())
  }

  const choose = (option) => {
    onChange(option)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openList()
    }
  }

  const handleListKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const next = (index + direction + options.length) % options.length
      optionRefs.current[next]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className={`lead-select ${open ? 'lead-select--open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`lead-select__trigger ${selectedIndex >= 0 ? 'lead-select__trigger--selected' : ''}`}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedIndex >= 0 ? options[selectedIndex] : placeholder}</span>
        <span className="lead-select__chevron" aria-hidden="true" />
      </button>
      {open && (
        <div id={listId} className="lead-select__list" role="listbox" aria-labelledby={labelId}>
          {options.map((option, index) => (
            <button
              ref={(element) => { optionRefs.current[index] = element }}
              key={option}
              type="button"
              className={`lead-select__option ${index === selectedIndex ? 'lead-select__option--selected' : ''}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => choose(option)}
              onKeyDown={(event) => handleListKeyDown(event, index)}
            >
              <span>{option}</span>
              <span className="lead-select__check" aria-hidden="true">✓</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
