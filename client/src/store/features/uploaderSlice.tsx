import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the interface for the Uploader object
export interface Uploader {
  id: number;
  description: string;
  file: File | null;
  link?: string;
}

// Define the initial state of the uploader slice
interface UploaderState {
  uploaders: Uploader[];
  // Add a status property to the state interface
  getFileStatus: "idle" | "loading" | "success" | "failed";
}

const initialState: UploaderState = {
  uploaders: [] as Uploader[],
  getFileStatus: "idle"
};

// Create an async thunk to fetch uploaders from the API using Axios
export const fetchUploader = createAsyncThunk(
  "uploader/fetchGet",
  async () => {
    const response = await axios.get("http://localhost:3003/api/files/");
    console.log("Response: ", response.data)
    return response.data.files;
  }
);

// Create an async thunk to save an uploader using Axios
export const saveUploader = createAsyncThunk(
  "uploader/save",
  async ({ description, file }: { description: string; file: File }, thunkAPI) => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("file", file);
    const response = await axios.post("http://localhost:3003/api/files/", formData);
    return response.data;
  }
);

// Create an async thunk to delete an uploader using Axios
export const deleteUploader = createAsyncThunk(
  "uploader/delete",
  async (id: number, thunkAPI) => {
    await axios.delete(`http://localhost:3003/api/files/deleteFile/${id}`);
    return id;
  }
);

// Create an async thunk to update an uploader using Axios
export const updateUploader = createAsyncThunk(
  "uploader/update",
  async ({ id, description, file }: { id: number; description: string; file: File }, thunkAPI) => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("file", file);
    const response = await axios.put(`http://localhost:3003/api/files/update/${id}`, formData);
    return response.data;
  }
);

// Create a slice for the uploader
export const uploaderSlice = createSlice({
  name: "uploader",
  initialState,
  reducers: {
    addUploader: (state, action: PayloadAction<{ description: string; file: File | null }>) => {
      state.uploaders.push({
        id: state.uploaders.length + 1, // Generate unique id
        description: action.payload.description,
        file: action.payload.file,
      });
    },
    deleteUploaderLocally: (state, action: PayloadAction<number>) => {
      state.uploaders = state.uploaders.filter(uploader => uploader.id !== action.payload);
    },
    updateUploaderLocally: (state, action: PayloadAction<{ id: number; description: string; file: File | null }>) => {
      const { id, description, file } = action.payload;
      const uploaderToUpdate = state.uploaders.find(uploader => uploader.id === id);
      if (uploaderToUpdate) {
        uploaderToUpdate.description = description;
        uploaderToUpdate.file = file;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUploader.fulfilled, (state, action) => {
        state.getFileStatus = "success";
        state.uploaders = action.payload;
      }).addCase(fetchUploader.pending, (state) => {
        state.getFileStatus = "loading";
      }).addCase(fetchUploader.rejected, (state) => {
        state.getFileStatus = "failed";
      })

    builder.addCase(saveUploader.fulfilled, (state, action) => {
        state.uploaders.push(action.payload); // Assuming the payload is an Uploader object
      }).addCase(saveUploader.pending, (state) => {
        state.getFileStatus = "loading";
      }).addCase(saveUploader.rejected, (state) => {
        state.getFileStatus = "failed";
      })



      builder.addCase(deleteUploader.fulfilled, (state, action) => {
        state.uploaders = state.uploaders.filter(uploader => uploader.id !== action.payload);
      }).addCase(deleteUploader.pending, (state) => {
        state.getFileStatus = "loading";
      }).addCase(deleteUploader.rejected, (state) => {
        state.getFileStatus = "failed";
      })


      builder
      .addCase(updateUploader.pending, (state) => {
        state.getFileStatus = "loading";
      })
      .addCase(updateUploader.rejected, (state) => {
        state.getFileStatus = "failed";
      })
      .addCase(updateUploader.fulfilled, (state, action) => {
        const updatedUploader = action.payload;
        const index = state.uploaders.findIndex(uploader => uploader.id === updatedUploader.id);
        if (index !== -1) {
          state.uploaders[index] = updatedUploader;
        }
      });
  }
});

// Export actions
export const { addUploader, deleteUploaderLocally, updateUploaderLocally } = uploaderSlice.actions;

// Export reducer
export default uploaderSlice.reducer;
