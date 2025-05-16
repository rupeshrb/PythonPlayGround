export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  code: string;
}

export const templates: CodeTemplate[] = [
  {
    id: "basicInput",
    name: "Basic Input/Output",
    description: "Simple example of reading input and displaying output",
    preview: `# Basic input/output example
name = input("Enter your name: ")
print(f"Hello, {name}!")`,
    code: `# Basic input/output example
# This program takes a name as input and greets the user

# Get user input
name = input("Enter your name: ")

# Display a greeting
print(f"Hello, {name}!")
print(f"Welcome to Python Playground!")

# You can also get numeric input
age_str = input("How old are you? ")
try:
    age = int(age_str)
    print(f"Next year, you will be {age + 1} years old!")
except ValueError:
    print("That's not a valid age!")
`
  },
  {
    id: "bubbleSort",
    name: "Bubble Sort",
    description: "Implementation of the bubble sort algorithm",
    preview: `# Bubble sort implementation
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
    code: `# Bubble Sort Algorithm
# This program demonstrates how to implement the bubble sort algorithm

def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Get input from user
input_str = input("Enter numbers separated by spaces: ")
try:
    # Convert input string to list of integers
    numbers = [int(x) for x in input_str.split()]
    
    # Sort the numbers using bubble sort
    sorted_numbers = bubble_sort(numbers)
    
    # Print the sorted array
    print("Original array:", numbers)
    print("Sorted array:", sorted_numbers)
except ValueError:
    print("Please enter valid numbers separated by spaces.")
`
  },
  {
    id: "linearSearch",
    name: "Linear Search",
    description: "Simple implementation of linear search",
    preview: `# Linear search algorithm
def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1`,
    code: `# Linear Search Algorithm
# This program demonstrates how to implement the linear search algorithm

def linear_search(arr, x):
    """
    Searches for element x in array arr using linear search algorithm.
    Returns the index if found, -1 otherwise.
    """
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1

# Get array input from user
input_str = input("Enter numbers separated by spaces: ")
try:
    arr = [int(x) for x in input_str.split()]
    
    # Get the target element to search for
    target = int(input("Enter the number to search for: "))
    
    # Perform linear search
    result = linear_search(arr, target)
    
    # Display the result
    if result != -1:
        print(f"Element found at index {result}!")
    else:
        print("Element not found in the array.")
except ValueError:
    print("Please enter valid numbers.")
`
  },
  {
    id: "calculator",
    name: "Simple Calculator",
    description: "Basic calculator with user input",
    preview: `# Simple calculator
num1 = float(input("Enter first number: "))
op = input("Enter operator (+,-,*,/): ")
num2 = float(input("Enter second number: "))
if op == "+":
    print(f"Result: {num1 + num2}")`,
    code: `# Simple Calculator
# This program implements a basic calculator that performs arithmetic operations

def calculate(num1, operator, num2):
    """Perform calculation based on the operator"""
    if operator == "+":
        return num1 + num2
    elif operator == "-":
        return num1 - num2
    elif operator == "*":
        return num1 * num2
    elif operator == "/":
        if num2 == 0:
            return "Error: Division by zero"
        return num1 / num2
    else:
        return "Error: Invalid operator"

# Display welcome message
print("Welcome to Simple Calculator!")
print("Supported operations: +, -, *, /")

try:
    # Get first number
    num1 = float(input("Enter first number: "))
    
    # Get operator
    operator = input("Enter operator (+, -, *, /): ")
    
    # Get second number
    num2 = float(input("Enter second number: "))
    
    # Calculate and display result
    result = calculate(num1, operator, num2)
    print(f"Result: {result}")

except ValueError:
    print("Error: Please enter valid numbers.")
`
  },
  {
    id: "quickSort",
    name: "Quick Sort",
    description: "Implementation of the quick sort algorithm",
    preview: `# Quick sort implementation
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]`,
    code: `# Quick Sort Algorithm
# This program demonstrates how to implement quick sort in Python

def partition(arr, low, high):
    """
    This function takes the last element as pivot, places
    the pivot element at its correct position in sorted
    array, and places all smaller elements to left of
    pivot and all greater elements to right of pivot.
    """
    pivot = arr[high]  # pivot element
    i = low - 1  # index of smaller element
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    """
    The main function that implements QuickSort.
    arr[] --> Array to be sorted,
    low --> Starting index,
    high --> Ending index
    """
    if low < high:
        # pi is partitioning index, arr[pi] is now at right place
        pi = partition(arr, low, high)
        
        # Separately sort elements before partition and after partition
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

# Get user input
input_str = input("Enter numbers separated by spaces: ")
try:
    arr = [int(x) for x in input_str.split()]
    
    # Sort the array
    n = len(arr)
    print("Original array:", arr)
    quick_sort(arr, 0, n - 1)
    print("Sorted array:", arr)
except ValueError:
    print("Please enter valid numbers separated by spaces.")
`
  }
];
