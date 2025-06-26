# Camera Pro Application

## Overview

Camera Pro is a modern web-based camera application built with a full-stack architecture. The app provides advanced image processing capabilities with real-time preview, professional-grade filters, and mobile-optimized controls. It's designed as a progressive web app (PWA) with a focus on mobile camera functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom camera-specific design tokens
- **State Management**: React Query (TanStack Query) for server state
- **Router**: Wouter for lightweight client-side routing
- **Mobile Optimization**: Touch-friendly controls and responsive design

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Development**: Hot reloading with Vite integration

### Key Components

#### Camera System
- **Viewfinder**: Real-time camera preview with WebRTC MediaStream API
- **Capture**: High-resolution image capture with canvas-based processing
- **Controls**: Mobile-optimized touch controls for camera switching, flash, and settings
- **Permissions**: Camera access management with graceful error handling

#### Image Processing Engine
- **Unsharp Mask**: Professional sharpening with configurable amount, radius, and threshold
- **Color Space**: YCbCr color space adjustments for fine-tuned color correction
- **Basic Adjustments**: Brightness, contrast, and saturation controls
- **Blend Modes**: Multiple image blending capabilities with opacity control
- **Real-time Preview**: Live processing preview during adjustment

#### User Interface
- **Processing Panel**: Tabbed interface for filters, adjustments, and blend settings
- **Gallery**: Grid-based image browsing with selection capabilities
- **Preview Mode**: Full-screen image review with save/retake options
- **Toast System**: User feedback for actions and errors

#### Data Storage
- **Processed Images**: Stores original and processed image blobs
- **Processing Settings**: JSON-serialized filter and adjustment parameters
- **Metadata**: Creation timestamps and processing history

## Data Flow

1. **Camera Initialization**: App requests camera permissions and initializes MediaStream
2. **Live Preview**: Video stream renders in viewfinder with real-time processing overlay
3. **Image Capture**: Canvas captures high-resolution frame from video stream
4. **Processing Pipeline**: Image data flows through processing filters based on current settings
5. **Storage**: Processed images and settings are stored in PostgreSQL database
6. **Gallery Integration**: Stored images are accessible through gallery interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router (2KB gzipped)

### UI Dependencies
- **@radix-ui/react-***: Accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **lucide-react**: Consistent icon library

### Image Processing
- **Canvas API**: Native browser image manipulation
- **MediaDevices API**: Camera access and stream management
- **Web Share API**: Native sharing capabilities where supported

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 with automatic provisioning
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reloading**: Vite development server with HMR

### Production Deployment
- **Target**: Replit Autoscale deployment
- **Build Process**: Vite build for client, esbuild for server bundling
- **Static Assets**: Client assets served from dist/public
- **Database**: Neon Database serverless PostgreSQL
- **Environment**: Production mode with optimized bundles

### Build Configuration
- **Client Build**: `vite build` → dist/public
- **Server Build**: `esbuild server/index.ts` → dist/index.js
- **Bundle Strategy**: External packages for server, bundled client assets

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.