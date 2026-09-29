import torch
import sys

print("Python Executable:", sys.executable)
print("PyTorch Version  :", torch.__version__)
print("CUDA Available   :", torch.cuda.is_available())
if torch.cuda.is_available():
    print("Device Count     :", torch.cuda.device_count())
    print("Current Device   :", torch.cuda.current_device())
    print("Device Name      :", torch.cuda.get_device_name(0))
    print("VRAM (GB)        :", torch.cuda.get_device_properties(0).total_memory / (1024**3))
    # Quick tensor test on GPU
    x = torch.randn(10, 10, device="cuda")
    y = x @ x
    print("GPU Tensor Test  : SUCCESS! Output norm =", y.norm().item())
else:
    print("CUDA is NOT available.")
