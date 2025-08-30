import * as React from "react";
import * as Label from "@radix-ui/react-label";
import { IconButton } from "@radix-ui/react-toggle";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

const QuantityInput = ({ value, onChange, min = 1, max = 10 }) => {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center space-x-2">
      <Label.Root
        htmlFor="quantity"
        className="text-sm font-medium text-gray-700"
      >
        Quantity
      </Label.Root>

      <div className="flex items-center border rounded-lg bg-white overflow-hidden">
        <IconButton
          onClick={decrease}
          aria-label="Decrease quantity"
          className="p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MinusIcon className="w-4 h-4" />
        </IconButton>

        <input
          id="quantity"
          type="number"
          value={value}
          onChange={(e) =>
            onChange(
              Math.min(max, Math.max(min, parseInt(e.target.value) || min))
            )
          }
          className="w-12 text-center text-sm border-l border-r outline-none"
        />

        <IconButton
          onClick={increase}
          aria-label="Increase quantity"
          className="p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};

export default QuantityInput;
