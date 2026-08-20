import React from "react";
import Select from "react-select";

function CustomEditSelect(props) {
  return (
    <div
      style={{
        marginTop: props.margin ? props.margin : 0,
        flex: !props.widthFull ? 3 : null,
        width: props.width || "100%",
      }}
    >
      {props.label ? (
        <label style={{ fontSize: 14, color: "var(--text)", fontWeight: "bold" }}>
          {props.label}
        </label>
      ) : null}
      <div style={{ marginTop: 5 }}>
        <Select
          isMulti={props.isMulti}
          value={
            props.value
              ? props.options.find((option) => option.value === props.value) || { value: props.value, label: props.value }
              : null
          }
          isDisabled={props.disabled}
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary: "var(--button)",
              neutral0: "var(--background-1)",
              neutral80: "var(--text)",
            },
          })}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "var(--background-1)",
              border: state.isFocused ? "2px solid var(--button)" : "1px solid var(--button)",
              boxShadow: state.isFocused ? "0 0 0 1px var(--button)" : "none",
              outline: "none",
              opacity: props.disabled ? 0.5 : 1,
              minHeight: "40px",
              color: "var(--text)",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              zIndex: 1400,
              backgroundColor: "var(--background-1)",
              border: "1px solid var(--button)",
            }),
            menuPortal: (baseStyles) => ({
              ...baseStyles,
              zIndex: 1400,
            }),
            option: (provided, state) => ({
              ...provided,
              color: state.isFocused ? "white" : "var(--text)",
              backgroundColor: state.isSelected
                ? "var(--button)"
                : state.isFocused
                  ? "var(--button-hover)"
                  : "transparent",
              "&:active": {
                backgroundColor: "var(--button)",
              },
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: "var(--text)",
            }),
            input: (baseStyles) => ({
              ...baseStyles,
              color: "var(--text)",
            }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              color: "var(--gray-text)",
            }),
          }}
          onChange={(e) => {
            if (!props.disabled) {
              if (props.return === "target") {
                props.onChange(e);
              } else {
                props.onChange(props.isMulti ? e : (e ? e.value : ""));
              }
            }
          }}
          options={props.options}
          isSearchable={true}
          placeholder={props.placeholder}
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        />
      </div>
    </div>
  );
}

export default CustomEditSelect;
