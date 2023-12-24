import logging

class CustomLogger(logging.Logger):
    def __init__(self, name, level=logging.NOTSET):
        super().__init__(name, level)
        # 进行自定义的初始化操作
        self.setLevel(logging.INFO)
        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

        # Log to console
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        self.addHandler(handler)

        # Also log to a file
        file_handler = logging.FileHandler("cpy-errors.log")
        file_handler.setFormatter(formatter)
        self.addHandler(file_handler)
