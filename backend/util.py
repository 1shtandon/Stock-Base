class CustomSerializable:
    def __iter__(self):
        if hasattr(self, 'to_dict'):
            for key, val in self.to_dict().items():
                yield key, val
        for key in self.__dict__:
            yield key, getattr(self, key)
